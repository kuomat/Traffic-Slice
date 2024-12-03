from screener.src.AlertSetup import AlertSetup
from screener.src.Screeners.RegexScreener import RegexScreener
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
        alert_setup: AlertSetup,
        db_connection: sqlite3.Connection,
    ) -> None:
        """
        Initialize the MacAddrScreener with the MAC address regex pattern.

        Args:
            alert_setup: The alert configuration
            db_connection: SQLite database connection
        """
        mac_pattern = r"(?:[0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2}"
        super().__init__(alert_setup, db_connection, mac_pattern)
