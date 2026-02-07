# Where's My Money — Full-stack Setup

This repo now has:
- **Python agent/core logic** in `app/` (source of truth)
- **FastAPI backend** in `backend/app/`
- **Static Twilight/Twinlight frontend** in `frontend thingy/` + `js/` + `css/`
- **Run scripts** in `scripts/` for Bash and PowerShell

## Repo layout

```text
.
├── app/                      # existing finance agent logic (source of truth)
├── backend/
│   ├── __init__.py
│   └── app/
│       ├── main.py           # FastAPI app
│       ├── api/schemas.py    # request/response models
│       └── core/agent_service.py
├── frontend thingy/          # UI HTML pages
├── js/                       # frontend JS
├── css/                      # frontend CSS
├── scripts/
│   ├── run_backend.sh
│   ├── run_backend.ps1
│   ├── run_frontend.sh
│   ├── run_frontend.ps1
│   └── smoke_test_api.py
└── requirements.txt
```

---

## Linux/macOS setup

### Backend terminal

```bash
cd /path/to/Hackathon
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend terminal

```bash
cd /path/to/Hackathon
export FRONTEND_API_BASE_URL=http://127.0.0.1:8000
./scripts/run_frontend.sh
```

---

## Windows PowerShell setup

### Backend terminal

```powershell
cd C:\Users\<you>\Documents\GitHub\Hackathon
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```

Or one command:

```powershell
.\scripts\run_backend.ps1
```

### Frontend terminal

```powershell
cd C:\Users\<you>\Documents\GitHub\Hackathon
$env:FRONTEND_API_BASE_URL = "http://127.0.0.1:8000"
.\scripts\run_frontend.ps1
```

Open:
- `http://127.0.0.1:5173/frontend%20thingy/index.html`
- `http://127.0.0.1:5173/frontend%20thingy/ai-chat.html`

---

## API

- `GET /health` → `{"status":"ok"}`
- `POST /chat`

`POST /chat` body example:

```json
{
  "message": "Hello",
  "user_id": "optional",
  "context": {
    "goal_aed": 500
  }
}
```

---

## Smoke test

With your virtualenv active:

```bash
python scripts/smoke_test_api.py
```

---

## Quick endpoint tests

### Bash

```bash
curl -s http://127.0.0.1:8000/health
curl -s -X POST http://127.0.0.1:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello","user_id":"demo","context":{"goal_aed":500}}'
```

### PowerShell

```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:8000/health" -Method Get

$body = @{ message = "Hello"; user_id = "demo"; context = @{ goal_aed = 500 } } | ConvertTo-Json -Depth 4
Invoke-RestMethod -Uri "http://127.0.0.1:8000/chat" -Method Post -ContentType "application/json" -Body $body
```

---

## Environment

Copy env file:

```bash
cp .env.example .env
```

Set:
- `LLM_API_KEY` (optional; fallback response is used if unset)
- `LLM_MODEL`, `LLM_PROVIDER` as needed
