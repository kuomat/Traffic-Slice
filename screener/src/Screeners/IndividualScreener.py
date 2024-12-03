from abc import ABC, abstractmethod
import sqlite3
from typing import List, Optional
from mitmproxy import tcp
from mitmproxy import http
from mitmproxy.utils import strutils
import logging

from screener.src.AlertSetup import AlertSetup


class IndividualScreener(ABC):
    """
    IndividualScreener is an abstract class that defines the interface for a screener
    for a certain type of warning.

    These can be directly used as a mitmproxy addon.

    Subclasses must implement the screen method.

    Implementations screen both TCP and HTTP traffic.
    """

    alert_setup: AlertSetup
    """The setup of the alert that this screener screens for"""

    db_connection: sqlite3.Connection
    """The connection to the database"""

    def __init__(
        self, alert_setup: AlertSetup, db_connection: sqlite3.Connection
    ) -> None:
        self.alert_setup = alert_setup
        self.db_connection = db_connection

    def save_tcp_message_to_db(self, tcp_message: tcp.TCPFlow) -> int:
        """Save the TCP message to the database and return the ID"""
        cursor = self.db_connection.cursor()
        cursor.execute(
            """
            INSERT INTO tcp_messages (
                flow_id, client_host, client_port, 
                server_host, server_port, message_content
            ) VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                tcp_message.id,
                (
                    tcp_message.client_conn.address[0]
                    if tcp_message.client_conn and tcp_message.client_conn.address
                    else None
                ),  # client host
                (
                    tcp_message.client_conn.address[1]
                    if tcp_message.client_conn and tcp_message.client_conn.address
                    else None
                ),  # client port
                (
                    tcp_message.server_conn.address[0]
                    if tcp_message.server_conn and tcp_message.server_conn.address
                    else None
                ),  # server host
                (
                    tcp_message.server_conn.address[1]
                    if tcp_message.server_conn and tcp_message.server_conn.address
                    else None
                ),  # server port
                tcp_message.messages[0].content if tcp_message.messages else None,
            ),
        )
        self.db_connection.commit()

        new_id = cursor.lastrowid
        if new_id is None:
            raise Exception("Failed to save TCP message to database")
        return new_id

    def save_http_request_to_db(self, http_request: http.HTTPFlow) -> int:
        """Save the HTTP request to the database and return the ID"""
        cursor = self.db_connection.cursor()
        cursor.execute(
            """
            INSERT INTO http_requests (
                flow_id, url, method, headers, request_content
            ) VALUES (?, ?, ?, ?, ?)
            """,
            (
                http_request.id,
                http_request.request.url,
                http_request.request.method,
                str(http_request.request.headers),
                http_request.request.text,
            ),
        )
        self.db_connection.commit()

        new_id = cursor.lastrowid
        if new_id is None:
            raise Exception("Failed to save HTTP request to database")
        return new_id

    def save_alert_to_db(self, message: str) -> int:
        """Save the alert to the database without any relationships.

        Returns the ID of the alert.
        """

        application_from = "UNKNOWN"
        destination_domain = "UNKNOWN"

        cursor = self.db_connection.cursor()
        cursor.execute(
            """
            INSERT INTO alerts (alert_name, message, application_from, destination_domain, type, severity)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                self.alert_setup.alert_name,
                message,
                application_from,
                destination_domain,
                self.alert_setup.type,
                self.alert_setup.severity,
            ),
        )

        new_id = cursor.lastrowid
        if new_id is None:
            raise Exception("Failed to save alert to database")
        return new_id

    def add_tcp_message_to_alert(self, alert_id: int, tcp_message_id: int) -> None:
        """Add a TCP message to an alert"""
        cursor = self.db_connection.cursor()
        cursor.execute(
            "INSERT INTO alert_tcp_messages (alert_id, tcp_message_id) VALUES (?, ?)",
            (alert_id, tcp_message_id),
        )
        self.db_connection.commit()

    def add_http_request_to_alert(self, alert_id: int, http_request_id: int) -> None:
        """Add an HTTP request to an alert"""
        cursor = self.db_connection.cursor()
        cursor.execute(
            "INSERT INTO alert_http_requests (alert_id, http_request_id) VALUES (?, ?)",
            (alert_id, http_request_id),
        )
        self.db_connection.commit()

    def on_trigger(
        self,
        message: str,
        tcp_message: Optional[tcp.TCPFlow] = None,
        http_request: Optional[http.HTTPFlow] = None,
    ) -> None:
        """Handle the trigger of the screener"""
        # TODO update this logic to be more storage efficient

        # Store the alert in a the database
        alert_id = self.save_alert_to_db(message)

        # Store the TCP message in the database
        if tcp_message:
            tcp_message_id = self.save_tcp_message_to_db(tcp_message)
            self.add_tcp_message_to_alert(alert_id, tcp_message_id)

        # Store the HTTP request in the database
        if http_request:
            http_request_id = self.save_http_request_to_db(http_request)
            self.add_http_request_to_alert(alert_id, http_request_id)

    def request(self, flow: http.HTTPFlow) -> None:
        """Handle HTTP requests"""
        search_strings: List[str] = []
        if flow.request.text:
            search_strings.append(flow.request.text)
        if flow.request.url:
            search_strings.append(flow.request.url)
        if flow.request.headers:
            search_strings.append(str(flow.request.headers))

        triggered_message = self.screen(search_strings)
        if triggered_message:
            self.on_trigger(triggered_message, tcp_message=None, http_request=flow)

    def tcp_message(self, flow: tcp.TCPFlow) -> None:
        """Handle TCP messages"""
        pass

    # TODO we need a way to detect if a tcp message is part of a http request
    # TODO maybe we check the socket or ports or something

    @abstractmethod
    def screen(self, search_strings: List[str]) -> Optional[str]:
        """
        Screen the given search strings

        Returns a message if the screen is triggered.
        Otherwise, returns None.
        """
        pass
