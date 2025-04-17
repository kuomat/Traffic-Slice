import sqlite3
from typing import List
from Screeners import EnvVarScreener
from Screeners import FileNameScreener
from Screeners import MacAddrScreener
from Screeners import ClipboardScreener
from Screeners import LocationScreener
from Screeners import TimestampScreener
from Screeners.IndividualScreener import IndividualScreener

import mitmproxy.http as http
import mitmproxy.tcp as tcp


class AllScreenersCombined:
    """
    AllScreenersCombined combines all the screeners into a single object.

    This is a mitmproxy addon.
    """

    db_connection: sqlite3.Connection
    """The connection to the database"""

    screeners: List[IndividualScreener]
    """The list of screeners"""

    def __init__(self, database_path: str) -> None:
        # open db from ../database.db
        self.db_connection = sqlite3.connect(database_path)

        # initialize screeners
        self.screeners = [
            EnvVarScreener(self.db_connection),
            FileNameScreener(self.db_connection),
            MacAddrScreener(self.db_connection),
            ClipboardScreener(self.db_connection),
            LocationScreener(self.db_connection),
            TimestampScreener(self.db_connection),
        ]

    def request(self, flow: http.HTTPFlow) -> None:
        for screener in self.screeners:
            screener.request(flow)

    def tcp_message(self, flow: tcp.TCPFlow) -> None:
        for screener in self.screeners:
            screener.tcp_message(flow)
