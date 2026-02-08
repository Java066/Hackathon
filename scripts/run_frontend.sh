#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-5173}"
cd frontend

echo "Serving static UI at http://127.0.0.1:${PORT}/index.html"
python3 -m http.server "${PORT}"
