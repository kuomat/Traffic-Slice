from mitmproxy import ctx, http
import psutil

CPU_USAGE_THRESHOLD = 5
LARGE_PAYLOAD_THRESHOLD = 1024 * 1024  # 1 MB

def process_small_programs():
    """Returns a list of process IDs (PIDs) with low CPU usage."""
    small_program_pids = []
    for proc in psutil.process_iter(['pid', 'cpu_percent']):
        try:
            cpu_percent = proc.cpu_percent(interval=0.1)  # Measure CPU usage
            if cpu_percent < CPU_USAGE_THRESHOLD:
                small_program_pids.append(proc.info['pid'])
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            continue  # Skip processes that no longer exist or cannot be accessed
    return small_program_pids

class PayloadMonitor:
    def __init__(self):
        ## Get all the small programs
        self.small_program_pids = process_small_programs()

    ## This is called whenever a request is received
    def request(self, flow: http.HTTPFlow):
        # Get payload size and process ID
        payload_size = len(flow.request.content)
        process_id = flow.client_conn.pid  # Requires special setup to link PID to connection

        if payload_size > LARGE_PAYLOAD_THRESHOLD and process_id in self.small_program_pids:
            ctx.log.warn(f"Large payload detected: {payload_size} bytes from a low-CPU process (PID: {process_id})")

addons = [
    PayloadMonitor()
]
