$ErrorActionPreference = "Stop"

if (-not $env:FRONTEND_API_BASE_URL) {
  $env:FRONTEND_API_BASE_URL = "http://127.0.0.1:8000"
}

"window.__API_BASE_URL__ = `"$($env:FRONTEND_API_BASE_URL)`";" | Set-Content -Path "frontend/env.js"
Write-Host "Frontend API base URL: $($env:FRONTEND_API_BASE_URL)"
Write-Host "Serving static UI at http://127.0.0.1:5173/frontend%20thingy/index.html"
python -m http.server 5173
