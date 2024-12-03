# this is the entrypoint for the screener
import mitmproxy.http as http

from AllScreenersCombined import AllScreenersCombined

unified_screener = AllScreenersCombined(database_path="../database.db")

print("Initializing Addons")
addons = [unified_screener]
