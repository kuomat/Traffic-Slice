from AlertSetup import AlertSetup
from Screeners import RegexScreener
import sqlite3
import pyperclip

class ClipBoardScreener(RegexScreener):
    """
    ClipBoardScreener monitors clipboard content for sensitive information.
    """

    def __init__(self, db_connection: sqlite3.Connection) -> None:
        """
        Initialize the ClipBoardScreener.

        Args:
            db_connection: SQLite database connection
        """
        alert_setup: AlertSetup = AlertSetup(
            alert_name="Clipboard Leak",
            type="clipboard",
            severity=1,
        )
        super().__init__(alert_setup, db_connection)

    def screen(self, search_strings: list) -> str:
        """
        Screen the clipboard content against the provided search strings.

        Args:
            search_strings: List of strings to search for in clipboard content

        Returns:
            A message describing the match if found, None otherwise
        """
        clipboard_content = pyperclip.paste()
        if not clipboard_content:
            return None

        for search_string in search_strings:
            if search_string in clipboard_content:
                return f"Found clipboard content '{search_string}' in traffic"
        return None
