$ErrorActionPreference = "Stop"

Set-Location frontend
Write-Host "Serving static UI at http://127.0.0.1:5173/index.html"
python -m http.server 5173
