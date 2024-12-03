from screener.src.AlertSetup import AlertSetup
from screener.src.Screeners.RegexScreener import RegexScreener
import sqlite3


class FileNameScreener(RegexScreener):
    """
    FileNameScreener screens traffic for common file patterns and extensions.
    Detects patterns like:
    - document.pdf
    - image.jpg
    - script.exe
    - archive.zip
    """

    def __init__(
        self,
        alert_setup: AlertSetup,
        db_connection: sqlite3.Connection,
    ) -> None:
        """
        Initialize the FileNameScreener with a regex pattern for common file types.

        Args:
            alert_setup: The alert configuration
            db_connection: SQLite database connection
        """
        # Pattern matches filenames with common extensions
        # Format: word characters followed by a dot and common extensions
        file_pattern = r"\b[\w\-\.]+\.(pdf|doc|docx|txt|rtf|csv|xls|xlsx|exe|dll|bat|sh|py|js|html|htm|php|jpg|jpeg|png|gif|mp3|mp4|avi|mkv|zip|rar|7z|tar|gz)\b"
        super().__init__(alert_setup, db_connection, file_pattern)
