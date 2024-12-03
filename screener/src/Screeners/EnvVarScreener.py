from AlertSetup import AlertSetup
from Screeners.IndividualScreener import IndividualScreener
import sqlite3
from typing import List, Optional


class EnvVarScreener(IndividualScreener):
    """
    EnvVarScreener screens traffic for known environment variable values.
    Detects the following secrets:
    - System level secret key
    - User level secret key
    """

    def __init__(self, db_connection: sqlite3.Connection) -> None:
        """
        Initialize the EnvVarScreener.
        """
        alert_setup: AlertSetup = AlertSetup(
            alert_name="Environment Variable Leak",
            type="env_var",
            severity=5,
        )

        super().__init__(alert_setup, db_connection)

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
