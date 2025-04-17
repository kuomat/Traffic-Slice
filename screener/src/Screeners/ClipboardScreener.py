import sqlite3
import pyperclip
from typing import List, Optional

from AlertSetup import AlertSetup
from Screeners.IndividualScreener import IndividualScreener

class ClipboardScreener(IndividualScreener):
    """
    ClipboardScreener screens traffic for content that matches current clipboard data.
    Detects if sensitive information that was just copied is being transmitted.
    """

    def __init__(
        self,
        db_connection: sqlite3.Connection,
    ) -> None:
        """
        Initialize the ClipboardScreener with clipboard monitoring capabilities.

        Args:
            db_connection: SQLite database connection
        """
        alert_setup: AlertSetup = AlertSetup(
            alert_name="Clipboard Data Leak",
            type="clipboard",
            severity=4,
        )

        # Initialize with empty pattern
        self.current_clipboard = ""
        super().__init__(alert_setup, db_connection)

    def get_clipboard_content(self) -> str:
        """
        Gets the current clipboard content.
        Returns empty string if clipboard is empty or inaccessible.
        """
        try:
            content = pyperclip.paste()
            return content if content else ""
        except Exception:
            pass
        return ""

    def screen(self, search_strings: List[str]) -> Optional[str]:
        """
        Screen to check if clipboard content is being sent.

        Returns:
            str: A message if clipboard content is found in traffic, None otherwise
        """
        self.current_clipboard = self.get_clipboard_content()

        for search_string in search_strings:
            if self.current_clipboard and self.current_clipboard in search_string:
                preview = (self.current_clipboard[:47] + "...") if len(self.current_clipboard) > 50 else self.current_clipboard
                return f"Detected clipboard content in network traffic: '{preview}'"
        return None

