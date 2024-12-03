import pyperclip
from mitmproxy import http, ctx

# Global variable to store clipboard content
last_clipboard_content = ""

def update_clipboard():
    """Update the global clipboard content if it has changed."""
    global last_clipboard_content
    try:
        clipboard_content = pyperclip.paste().strip()
        if clipboard_content != last_clipboard_content:
            last_clipboard_content = clipboard_content
            ctx.log.info(f"Clipboard content updated: {last_clipboard_content}")
    except Exception as e:
        ctx.log.error(f"Failed to read clipboard: {e}")

def request(flow: http.HTTPFlow):
    """Intercept HTTP requests and check if clipboard content is being sent."""
    update_clipboard()
    global last_clipboard_content

    if last_clipboard_content and last_clipboard_content in flow.request.text:
        ctx.log.info(f"Detected clipboard content in request to {flow.request.host}")
        ctx.log.info(f"Matching clipboard content: {last_clipboard_content}")
