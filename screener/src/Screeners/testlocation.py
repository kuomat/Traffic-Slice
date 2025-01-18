from LocationScreener import LocationScreener

class MockDBConnection:
    """Mock database connection to bypass actual database usage."""
    def cursor(self):
        return self

    def execute(self, *args, **kwargs):
        pass

    def commit(self):
        pass

    def close(self):
        pass


def test_location_screener():
    # Mock a database connection
    mock_db = MockDBConnection()

    # Initialize the LocationScreener
    screener = LocationScreener(mock_db)

    # Define test data
    test_cases = [
        ("https://maps.googleapis.com/maps/api/geocode/json?lat=40.7128&lng=-74.0060", "Request to known location service detected"),
        ('{"latitude": 37.7749, "longitude": -122.4194}', "Location data detected in JSON payload"),
        ("Random text with no location data", None),
        ("Coordinate: 51.5074, -0.1278", "Coordinate pair detected in traffic"),
    ]

    # Run the tests
    for test_input, expected_output in test_cases:
        result = screener.screen([test_input])
        print(f"Input: {test_input}")
        print(f"Expected: {expected_output}, Got: {result}")
        assert result == expected_output, f"Failed on input: {test_input}"

    print("All tests passed!")


if __name__ == "__main__":
    test_location_screener()
