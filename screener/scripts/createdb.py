import sqlite3
import pathlib

# Get the current directory and schema file
current_dir = pathlib.Path(__file__).parent
schema_path = current_dir / "../../schema.sql"


def create_database(db_name="../database.db"):
    """Create a new database using the schema.sql file"""
    try:
        # Connect to database (this will create it if it doesn't exist)
        conn = sqlite3.connect(db_name)

        # Read the schema file
        with open(schema_path, "r") as f:
            schema = f.read()

        # Execute the schema
        conn.executescript(schema)

        print(f"Database '{db_name}' created successfully!")

    except sqlite3.Error as e:
        print(f"An error occurred: {e}")

    except FileNotFoundError:
        print(f"Schema file not found at: {schema_path}")

    finally:
        # Close the connection if it was opened
        if "conn" in locals():
            conn.close()


"""
This file should be run from the screener directory.
"""

if __name__ == "__main__":
    create_database()
