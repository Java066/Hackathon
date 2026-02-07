#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-5173}"
API_BASE_URL="${FRONTEND_API_BASE_URL:-http://127.0.0.1:8000}"

cat > frontend/env.js <<EOF
window.__API_BASE_URL__ = "${API_BASE_URL}";
EOF

echo "Frontend API base URL: ${API_BASE_URL}"
echo "Serving static UI at http://127.0.0.1:${PORT}/frontend%20thingy/index.html"
python3 -m http.server "${PORT}"
