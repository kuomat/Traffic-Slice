from AlertSetup import AlertSetup
from Screeners.RegexScreener import RegexScreener
import sqlite3


class MacAddrScreener(RegexScreener):
    """
    MacAddrScreener screens traffic for MAC addresses in various formats.
    Supports formats like:
    - 00:11:22:33:44:55
    - 00-11-22-33-44-55
    """

    def __init__(
        self,
        db_connection: sqlite3.Connection,
    ) -> None:
        """
        Initialize the MacAddrScreener with the MAC address regex pattern.

        Args:
            db_connection: SQLite database connection
        """

        alert_setup: AlertSetup = AlertSetup(
            alert_name="MAC Address Leak",
            type="mac_addr",
            severity=1,
        )

        mac_pattern = r"(?:[0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2}"
        super().__init__(alert_setup, db_connection, mac_pattern)
