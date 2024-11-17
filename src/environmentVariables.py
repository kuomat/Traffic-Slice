"""
Process individual messages from a TCP connection.

Detects the egress of the TRAFFIC_SLICE_SECRET_KEY environment variable.

Example Invocation:

mitmdump --tcp-hosts ".*" -s .\src\environmentVariables.py --set flow_detail=0
"""

import logging
import re
from mitmproxy import tcp
from mitmproxy.utils import strutils

SECRET_KEY_SYSTEM_LEVEL = "CqyTJns6LOXtDRxmlkuNAFfV91UjgreE"
SECRET_KEY_SYSTEM_LEVEL_REGEX = re.compile(SECRET_KEY_SYSTEM_LEVEL.encode())

SECRET_KEY_USER_LEVEL = "TqyTJns6LOXtDRxmlkuNAFfV91UjgreEq"
SECRET_KEY_USER_LEVEL_REGEX = re.compile(SECRET_KEY_USER_LEVEL.encode())


def tcp_message(flow: tcp.TCPFlow):
    message = flow.messages[-1]

    systemKeyFound = SECRET_KEY_SYSTEM_LEVEL_REGEX.findall(message.content)
    userKeyFound = SECRET_KEY_USER_LEVEL_REGEX.findall(message.content)

    # Check if packet contains either secret key
    if systemKeyFound:
        logging.warning(
            f"Found secret key in message!\n"
            f"From client: {message.from_client}\n"
            f"System level secret key found: {SECRET_KEY_SYSTEM_LEVEL}\n"
            f"Content: {strutils.bytes_to_escaped_str(message.content)}"
        )

    if userKeyFound:
        logging.warning(
            f"Found secret key in message!\n"
            f"From client: {message.from_client}\n"
            f"User level secret key found: {SECRET_KEY_USER_LEVEL}\n"
            f"Content: {strutils.bytes_to_escaped_str(message.content)}"
        )
