#!/usr/bin/env python3
"""Serve the editable site locally and refresh pages when files change."""

import argparse
import hashlib
import io
import json
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit


SITE_DIRECTORY = Path(__file__).resolve().parent / "dist"
VERSION_PATH = "/_local_preview/version"


def site_version():
    digest = hashlib.sha256()
    for path in sorted(SITE_DIRECTORY.rglob("*")):
        relative = path.relative_to(SITE_DIRECTORY)
        if any(part.startswith(".") for part in relative.parts):
            continue
        try:
            if not path.is_file():
                continue
            stat = path.stat()
        except OSError:
            # Editors can briefly remove a file while saving it atomically.
            continue
        digest.update(str(relative).encode("utf-8"))
        digest.update(f":{stat.st_mtime_ns}:{stat.st_size}\n".encode("ascii"))
    return digest.hexdigest()


def reload_script():
    return ("""
<script data-local-preview>
(() => {
  const version = %s;
  async function checkForChanges() {
    try {
      const response = await fetch('%s', { cache: 'no-store' });
      if (response.ok && (await response.json()).version !== version) {
        location.reload();
        return;
      }
    } catch { /* Retry if the local preview is temporarily unavailable. */ }
    setTimeout(checkForChanges, 1000);
  }
  setTimeout(checkForChanges, 1000);
})();
</script>
""" % (json.dumps(site_version()), VERSION_PATH)).encode("utf-8")


class PreviewHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(SITE_DIRECTORY), **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def content_response(self, content, content_type):
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(content)))
        self.end_headers()
        return io.BytesIO(content)

    def send_head(self):
        request_path = urlsplit(self.path).path
        if request_path == VERSION_PATH:
            content = json.dumps({"version": site_version()}).encode("utf-8")
            return self.content_response(content, "application/json; charset=utf-8")

        candidate = Path(self.translate_path(self.path))
        if candidate.is_dir():
            candidate = candidate / "index.html"
        if candidate.suffix.lower() == ".html" and candidate.is_file():
            content = candidate.read_bytes()
            script = reload_script()
            if b"</body>" in content:
                content = content.replace(b"</body>", script + b"</body>", 1)
            else:
                content += script
            return self.content_response(content, "text/html; charset=utf-8")
        return super().send_head()

    def log_message(self, format, *args):
        # The browser polls once a second; only log actual page/asset requests.
        if urlsplit(self.path).path != VERSION_PATH:
            super().log_message(format, *args)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--port", type=int, default=8765)
    args = parser.parse_args()
    with ThreadingHTTPServer(("127.0.0.1", args.port), PreviewHandler) as server:
        print(f"Local preview: http://127.0.0.1:{server.server_port}/", flush=True)
        print(f"Serving {SITE_DIRECTORY}", flush=True)
        print("Save a site file to refresh the browser automatically. Ctrl+C stops the preview.", flush=True)
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            print("\nPreview stopped.", flush=True)


if __name__ == "__main__":
    main()
