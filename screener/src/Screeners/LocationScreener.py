from AlertSetup import AlertSetup
from Screeners.IndividualScreener import IndividualScreener
import sqlite3
from typing import List, Optional, Tuple
import json
import re
from collections import defaultdict
import time
from mitmproxy import http
import math
import geocoder


class LocationScreener(IndividualScreener):
    """
    Screens traffic for location data in different formats.
    Detects when coordinates in traffic are close to the device's actual location.
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
        
        # Get the device's actual location and cache it
        self.device_location = self.get_device_location()
        self.location_refresh_time = time.time()
        
        # Distance threshold in kilometers - coordinates within this distance
        # from the device are considered "nearby"
        self.distance_threshold = 10.0  # 10km

    def get_device_location(self) -> Tuple[float, float]:
        """
        Get the device's current location using geocoder.
        Returns (latitude, longitude) tuple.
        """
        try:
            # Try to get location from IP-based geocoding
            g = geocoder.ip('me')
            if g.ok:
                return (g.lat, g.lng)
            
            # Fallback to a different IP geocoding provider if first one fails
            # Note: This might require additional permissions depending on the platform
            g = geocoder.ipinfo('me')  # Using ipinfo instead of geoip
            if g.ok:
                return (g.lat, g.lng)
                
            # If all else fails, return a default location
            return (0.0, 0.0)
        except Exception:
            # Default coordinates if location detection fails
            return (0.0, 0.0)
    
    def calculate_distance(self, lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """
        Calculate the Haversine distance between two points in kilometers.
        """
        # Earth radius in kilometers
        R = 6371.0
        
        # Convert latitude and longitude from degrees to radians
        lat1_rad = math.radians(lat1)
        lon1_rad = math.radians(lon1)
        lat2_rad = math.radians(lat2)
        lon2_rad = math.radians(lon2)
        
        # Differences
        dlat = lat2_rad - lat1_rad
        dlon = lon2_rad - lon1_rad
        
        # Haversine formula
        a = math.sin(dlat / 2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon / 2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        distance = R * c
        
        return distance

    def extract_coordinates(self, text: str) -> List[Tuple[float, float]]:
        """Extract all valid coordinate pairs from text."""
        # Regular expression pattern to match coordinate pairs in the format "latitude,longitude"
        # Matches decimal numbers (positive or negative) separated by a comma with optional whitespace
        # Examples: "37.7749,-122.4194" or "37.7749, -122.4194" or "-33.8688, 151.2093"
        coord_pattern = r"-?\d+\.\d+\s*,\s*-?\d+\.\d+"
        matches = re.finditer(coord_pattern, text)
        
        coordinates = []
        for match in matches:
            try:
                lat, lon = map(float, re.split(r'\s*,\s*', match.group()))
                if -90 <= lat <= 90 and -180 <= lon <= 180:
                    coordinates.append((lat, lon))
            except ValueError:
                continue
        return coordinates

    def is_coordinate_pair(self, text: str) -> Tuple[bool, Optional[str]]:
        """
        Check if text contains coordinate pairs and if they are close to the device's location.
        Returns (is_coordinate, alert_message)
        """
        coordinates = self.extract_coordinates(text)
        
        if not coordinates:
            return False, None
            
        # Refresh device location if more than 15 minutes have passed
        current_time = time.time()
        if current_time - self.location_refresh_time > 900:  # 15 minutes
            self.device_location = self.get_device_location()
            self.location_refresh_time = current_time
            
        device_lat, device_lng = self.device_location
        
        for lat, lng in coordinates:
            distance = self.calculate_distance(device_lat, device_lng, lat, lng)
            
            if distance <= self.distance_threshold:
                return True, f"Detected coordinates ({lat:.4f}, {lng:.4f}) are {distance:.2f}km from your actual location"
        
        # Found coordinates, but they're not close to the device
        return True, "Coordinate pair detected in traffic"

    def extract_json_coordinates(self, data) -> List[Tuple[float, float]]:
        """Recursively extract coordinates from JSON data"""
        coordinates = []
        
        if isinstance(data, dict):
            # Check for common location patterns in objects
            if all(k in data for k in ['lat', 'lng']):
                try:
                    lat, lng = float(data['lat']), float(data['lng'])
                    if -90 <= lat <= 90 and -180 <= lng <= 180:
                        coordinates.append((lat, lng))
                except (ValueError, TypeError):
                    pass
            elif all(k in data for k in ['latitude', 'longitude']):
                try:
                    lat, lng = float(data['latitude']), float(data['longitude'])
                    if -90 <= lat <= 90 and -180 <= lng <= 180:
                        coordinates.append((lat, lng))
                except (ValueError, TypeError):
                    pass
                    
            # Recursively search nested structures
            for v in data.values():
                if isinstance(v, (dict, list)):
                    coordinates.extend(self.extract_json_coordinates(v))
        elif isinstance(data, list):
            for item in data:
                if isinstance(item, (dict, list)):
                    coordinates.extend(self.extract_json_coordinates(item))
                    
        return coordinates

    def check_json_for_location(self, text: str) -> Tuple[bool, Optional[str]]:
        """
        Check JSON content for location data, comparing with device location.
        Returns (found_location, alert_message)
        """
        try:
            data = json.loads(text)
            
            # First, look for coordinates
            coordinates = self.extract_json_coordinates(data)
            
            if coordinates:
                device_lat, device_lng = self.device_location
                
                for lat, lng in coordinates:
                    distance = self.calculate_distance(device_lat, device_lng, lat, lng)
                    
                    if distance <= self.distance_threshold:
                        return True, f"Detected coordinates ({lat:.4f}, {lng:.4f}) in JSON are {distance:.2f}km from your actual location"
            
            # If no nearby coordinates, check for location keywords
            def search_dict(d):
                if isinstance(d, dict):
                    for k, v in d.items():
                        if isinstance(v, (dict, list)):
                            if search_dict(v):
                                return True
                elif isinstance(d, list):
                    for item in d:
                        if search_dict(item):
                            return True
                return False
                
            if search_dict(data):
                return True, "Location-related data detected in JSON payload"
                
            return False, None
            
        except json.JSONDecodeError:
            return False, None

    def screen(self, search_strings: List[str]) -> Optional[str]:
        """
        Screen the provided strings for location data.
        Checks if coordinates are near the device's actual location.
        """
        for search_string in search_strings:
            # Skip empty strings
            if not search_string:
                continue

            # Check for suspicious hosts
            if any(host in search_string.lower() for host in self.suspicious_hosts):
                return f"Request to known location service detected"

            # Check for coordinate pairs
            is_coord, coord_message = self.is_coordinate_pair(search_string)
            if is_coord:
                return coord_message

            # Check JSON content
            json_found, json_message = self.check_json_for_location(search_string)
            if json_found:
                return json_message

            # Check for location keywords in headers or URL as a last resort
            for keyword in self.location_keywords:
                if keyword in search_string.lower():
                    return f"Location-related keyword '{keyword}' detected"

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