from AlertSetup import AlertSetup
from Screeners.IndividualScreener import IndividualScreener
import sqlite3
from typing import List, Optional
import json
import re
from collections import defaultdict
import time
from mitmproxy import http


class LocationScreener(IndividualScreener):
    """
    this looks fors/screens traffic for location data in diff formats
    finds:
    *coordinate patterns (lat/long)
    -Location-related API endpoints
    -Location data in request bodies
    -binary location data patterns(not done yet, also dont know if this would be ne)
    """

    def __init__(self, db_connection: sqlite3.Connection) -> None:
        alert_setup: AlertSetup = AlertSetup(
            alert_name="Location Data Leak",
            type="location",
            severity=3,
        )
        super().__init__(alert_setup, db_connection)
        
        # keep track frequency of location data per application
        self.app_alerts = defaultdict(int)
        self.last_alert_time = time.time()
        
        # List of known location-related endpoints
        self.suspicious_hosts = [
            "maps.googleapis.com",
            "location.services.mozilla.com",
            "api.openstreetmap.org",
            "nominatim.openstreetmap.org",
        ]

        # location keywords
        self.location_keywords = [
            "latitude", "longitude", "lat", "lng", "loc",
            "gps", "geo", "location", "coordinates",
            "position", "tracking"
        ]

    def is_coordinate_pair(self, text: str) -> bool:
        """Check if text contains coordinate pairs"""
        # Look for patterns like "40.7128,-74.0060" or "40.7128, -74.0060"
        coord_pattern = r"-?\d+\.\d+\s*,\s*-?\d+\.\d+"
        matches = re.finditer(coord_pattern, text)
        
        for match in matches:
            try:
                lat, lon = map(float, re.split(r'\s*,\s*', match.group()))
                if -90 <= lat <= 90 and -180 <= lon <= 180:
                    return True
            except ValueError:
                continue
        return False

    def check_json_for_location(self, text: str) -> bool:
        """Check JSON content for location data"""
        try:
            data = json.loads(text)
            # Recursively search through JSON for location keywords
            def search_dict(d):
                if isinstance(d, dict):
                    for k, v in d.items():
                        if any(keyword in k.lower() for keyword in self.location_keywords):
                            return True
                        if isinstance(v, (dict, list)):
                            if search_dict(v):
                                return True
                elif isinstance(d, list):
                    for item in d:
                        if search_dict(item):
                            return True
                return False
            return search_dict(data)
        except json.JSONDecodeError:
            return False

    def screen(self, search_strings: List[str]) -> Optional[str]:
        """
        Screen the provided strings for location data.
        Implements sampling to reduce false positives.
        """
        for search_string in search_strings:
            # Skip empty strings
            if not search_string:
                continue

            # Check for suspicious hosts
            if any(host in search_string.lower() for host in self.suspicious_hosts):
                return f"Request to known location service detected"

            # Check for coordinate pairs
            if self.is_coordinate_pair(search_string):
                return f"Coordinate pair detected in traffic"

            # Check for location keywords in headers or URL
            if any(keyword in search_string.lower() for keyword in self.location_keywords):
                return f"Location-related keyword detected"

            # Check JSON content
            if self.check_json_for_location(search_string):
                return f"Location data detected in JSON payload"

        return None

    def request(self, flow: http.HTTPFlow) -> None:
        """Override request to implement rate limiting"""
        app_id = flow.request.host
        current_time = time.time()
        
        # Reset counters if more than 10 minutes have passed
        if current_time - self.last_alert_time > 600:
            self.app_alerts.clear()
            self.last_alert_time = current_time

        # Call parent's request method
        super().request(flow)
        
        # Increment alert counter for this app
        self.app_alerts[app_id] += 1