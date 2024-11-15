from mitmproxy import http, ctx

def request(flow: http.HTTPFlow):
    if "content-type" in flow.request.headers:
        content_type = flow.request.headers["content-type"]

        # Check if the content type indicates a multipart form data (file upload)
        if "multipart/form-data" in content_type:
            content = flow.request.text
            lines = content.split("\r\n")

            # Iterate over lines to find the filename
            for line in lines:
                if "filename=" in line:
                    # Extract the filename from the Content-Disposition header
                    filename = line.split("filename=")[-1].strip("\"")
                    ctx.log.info(f"Intercepted file upload: {filename}")
                    break
