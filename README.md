# Where's My Money — Full-stack Setup

This repo now has:
- **Python agent/core logic** in `app/` (kept as source of truth)
- **FastAPI backend** in `backend/app/`
- **Static Twilight/Twinlight frontend** in `frontend thingy/` + `js/` + `css/`
- **Run scripts** in `scripts/`

## Repo layout

```text
.
├── app/                      # existing finance agent logic (source of truth)
├── backend/
│   └── app/
│       ├── main.py           # FastAPI app
│       ├── api/schemas.py    # request/response models
│       └── core/agent_service.py
├── frontend thingy/          # UI HTML pages
├── js/                       # frontend JS
├── css/                      # frontend CSS
├── scripts/
│   ├── run_backend.sh
│   ├── run_frontend.sh
│   └── smoke_test_api.py
└── requirements.txt
```

## 1) Backend terminal

```bash
cd /workspace/Hackathon
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```

API endpoints:
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

## 2) Frontend terminal

```bash
cd /workspace/Hackathon
export FRONTEND_API_BASE_URL=http://127.0.0.1:8000
./scripts/run_frontend.sh
```

Open:
- `http://127.0.0.1:5173/frontend%20thingy/index.html`
- AI chat page: `http://127.0.0.1:5173/frontend%20thingy/ai-chat.html`

## 3) Smoke test

With the virtualenv active:

```bash
python scripts/smoke_test_api.py
```

## Environment

Copy env file:

```bash
cp .env.example .env
```

Set:
- `LLM_API_KEY` (optional; app has fallback response if unset)
- `LLM_MODEL`, `LLM_PROVIDER` as needed.

## Two-terminal quick start

Terminal 1:
```bash
./scripts/run_backend.sh
```

Terminal 2:
```bash
./scripts/run_frontend.sh
```
