from AlertSetup import AlertSetup
from Screeners.IndividualScreener import IndividualScreener
import sqlite3
from typing import List, Optional
import re
from collections import defaultdict
import time

class TimestampScreener(IndividualScreener):
    """
    TimestampScreener monitors for excessive timestamp patterns in traffic.
    Detects:
    - Unix timestamps (e.g., 1709663548)
    - ISO 8601 timestamps (e.g., 2024-03-05T19:32:28Z)
    - Common date formats (e.g., 2024-03-05, 03/05/2024)
    """

    def __init__(self, db_connection: sqlite3.Connection) -> None:
        alert_setup: AlertSetup = AlertSetup(
            alert_name="Excessive Timestamps",
            type="timestamps",
            severity=2,  # Medium-low severity
        )
        super().__init__(alert_setup, db_connection)
        
        # Track timestamps per application within time windows
        self.app_timestamps = defaultdict(list)
        self.THRESHOLD = 5  # Alert if more than 5 timestamps in window
        self.TIME_WINDOW = 60  # 60 second window
        
        # Timestamp patterns
        self.patterns = [
            # Unix timestamps (10 or 13 digits)
            r'\b\d{10}\b',  # Unix timestamp (seconds)
            r'\b\d{13}\b',  # Unix timestamp (milliseconds)
            
            # ISO 8601
            r'\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})',
            
            # Common date formats
            r'\d{4}-\d{2}-\d{2}',  # YYYY-MM-DD
            r'\d{2}/\d{2}/\d{4}',  # MM/DD/YYYY or DD/MM/YYYY
            r'\d{2}-\d{2}-\d{4}',  # MM-DD-YYYY or DD-MM-YYYY
            
            # Time formats
            r'\d{2}:\d{2}:\d{2}(?:\.\d+)?',  # HH:MM:SS[.mmm]
        ]
        
        # Combine all patterns
        self.timestamp_pattern = re.compile('|'.join(self.patterns))

    def is_valid_timestamp(self, timestamp_str: str) -> bool:
        """
        Validate if a string could reasonably be a timestamp.
        Helps filter out random numbers that match patterns.
        """
        try:
            # For Unix timestamps
            if timestamp_str.isdigit():
                ts = int(timestamp_str)
                # Check if timestamp is within reasonable range (2000-2050)
                if len(timestamp_str) == 10:  # seconds
                    return 946684800 <= ts <= 2524608000
                elif len(timestamp_str) == 13:  # milliseconds
                    return 946684800000 <= ts <= 2524608000000
            return True
        except ValueError:
            return False

    def cleanup_old_timestamps(self, app_id: str) -> None:
        """Remove timestamps outside the current time window"""
        current_time = time.time()
        self.app_timestamps[app_id] = [
            ts for ts in self.app_timestamps[app_id]
            if current_time - ts < self.TIME_WINDOW
        ]

    def find_timestamps(self, text: str) -> List[str]:
        """Find all timestamp patterns in the given text"""
        matches = self.timestamp_pattern.finditer(text)
        return [
            match.group() for match in matches
            if self.is_valid_timestamp(match.group())
        ]

    def screen(self, search_strings: List[str]) -> Optional[str]:
        """
        Screen the provided strings for timestamp patterns.
        Alerts if too many timestamps are found within the time window.
        """
        timestamps_found = []
        
        for search_string in search_strings:
            if not search_string:
                continue
                
            timestamps_found.extend(self.find_timestamps(search_string))
        
        if not timestamps_found:
            return None
            
        # Use the host as the app identifier
        app_id = (
            search_strings[1].split("/")[2]  # URL is typically the second search string
            if len(search_strings) > 1 and "/" in search_strings[1]
            else "unknown"
        )
        
        # Cleanup old timestamps
        self.cleanup_old_timestamps(app_id)
        
        # Add current timestamp
        current_time = time.time()
        self.app_timestamps[app_id].append(current_time)
        
        # Check if we've exceeded the threshold
        if len(self.app_timestamps[app_id]) > self.THRESHOLD:
            return (
                f"Detected {len(timestamps_found)} timestamps in request. "
                f"Application has sent {len(self.app_timestamps[app_id])} "
                f"timestamp-containing requests in the last {self.TIME_WINDOW} seconds."
            )
            
        return None 