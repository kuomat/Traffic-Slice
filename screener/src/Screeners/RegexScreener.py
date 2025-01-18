import re
from typing import List, Optional

from AlertSetup import AlertSetup
from Screeners import IndividualScreener
import sqlite3


class RegexScreener(IndividualScreener):
    """
    RegexScreener screens traffic by matching a regular expression pattern.
    """

    def __init__(
        self,
        alert_setup: AlertSetup,
        db_connection: sqlite3.Connection,
        regex_pattern: str,
    ) -> None:
        """
        Initialize the RegexScreener with a regex pattern to match against.

        Args:
            alert_setup: The alert configuration
            db_connection: SQLite database connection
            regex_pattern: The regular expression pattern to match
        """
        super().__init__(alert_setup, db_connection)
        self.pattern = re.compile(regex_pattern)

    def screen(self, search_strings: List[str]) -> Optional[str]:
        """
        Screen the given strings against the regex pattern.

        Returns:
            A message describing the match if found, None otherwise
        """
        for search_string in search_strings:
            match = self.pattern.search(search_string)
            if match:
                return f"Found '{match.group()}' matching pattern '{self.pattern.pattern}' in traffic"

        return None
