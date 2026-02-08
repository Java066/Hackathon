# Where's My Money — Full-stack Setup

This repo now has:
- **Python agent/core logic** in `app/` (source of truth)
- **FastAPI backend** in `backend/app/`
- **Static frontend** in `frontend/` (`index.html`, `js/`, `css/`)
- **Optional Bash run scripts** in `scripts/`

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
├── frontend/
│   ├── index.html
│   ├── ai-chat.html
│   ├── js/
│   └── css/
├── scripts/
│   ├── run_backend.sh
│   ├── run_frontend.sh
│   └── smoke_test_api.py
└── requirements.txt
```

## Run backend

```bash
cd /workspace/Hackathon
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```

## Run frontend (Windows-friendly, no PowerShell script execution)

```bash
cd /workspace/Hackathon/frontend
python -m http.server 5173
```

Open:
- Landing page (click **Try the demo**): `http://127.0.0.1:5173/index.html`
- Direct demo page: `http://127.0.0.1:5173/ai-chat.html`

Optional API override for frontend:
- Edit `frontend/js/config.js`, or set `window.API_BASE_URL` before `js/config.js` loads.

## Quick API tests

```bash
curl -s http://127.0.0.1:8000/health
curl -s -X POST http://127.0.0.1:8000/chat -H "Content-Type: application/json" -d '{"message":"Hello"}'
```
