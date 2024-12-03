from screener.src.AlertSetup import AlertSetup
import sqlite3
from typing import List, Optional


class EnvVarScreener:
    """
    EnvVarScreener screens traffic for known environment variable values.
    Detects the following secrets:
    - System level secret key
    - User level secret key
    """

    # Define the secret keys as class constants
    SYSTEM_LEVEL_KEY = "CqyTJns6LOXtDRxmlkuNAFfV91UjgreE"
    USER_LEVEL_KEY = "TqyTJns6LOXtDRxmlkuNAFfV91UjgreEq"

    def screen(self, search_strings: List[str]) -> Optional[str]:
        """
        Screen the provided strings for known secret keys.

        Returns:
            A message describing which specific secret was found, None otherwise
        """
        for search_string in search_strings:
            if self.SYSTEM_LEVEL_KEY in search_string:
                return "Found system level secret key in traffic"
            if self.USER_LEVEL_KEY in search_string:
                return "Found user level secret key in traffic"
        return None
