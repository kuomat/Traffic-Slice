"""
Process individual messages from a TCP connection.

Detect MAC addresses in the content.

Example Invocation:

mitmdump --tcp-hosts ".*" -s .\src\detectMacAddr.py --set flow_detail=0
"""

import logging
import re
from mitmproxy import tcp
from mitmproxy.utils import strutils

# Regular expression for matching MAC addresses (supports various formats)
MAC_ADDRESS_PATTERN = re.compile(rb"(?:[0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2}")


def tcp_message(flow: tcp.TCPFlow):
    message = flow.messages[-1]

    # Search for MAC addresses in the content
    mac_addresses = MAC_ADDRESS_PATTERN.findall(message.content)

    if mac_addresses:
        logging.info(
            f"Found MAC address in message!\n"
            f"From client: {message.from_client}\n"
            f"MAC addresses found: {[addr.decode() for addr in mac_addresses]}\n"
            f"Content: {strutils.bytes_to_escaped_str(message.content)}"
        )
