# Hackathon

This repo now has a single frontend app in `frontend/` (React dashboard) and the FastAPI backend in `backend/`.

## Repo layout

- `backend/` → FastAPI API (`/health`, `/chat`)
- `frontend/` → React dashboard app (the only active frontend)
- `_backup_frontends/` → legacy UI assets moved here safely (not deleted)
- `scripts/` → helper scripts

## Backend setup and run (Windows, no venv activation required)

Install backend dependencies if needed:

```powershell
.\.venv\Scripts\python.exe -m pip install -r backend\requirements.txt
```

Run backend:

```powershell
.\.venv\Scripts\python.exe -m uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8000
```

Backend URL: `http://127.0.0.1:8000`

## Frontend setup and run (Windows friendly)

The React app is CRA-based and supports `npm run dev` (alias to start).

```powershell
cd frontend
npm install
npm run dev
```

Frontend URL: `http://localhost:3000`

### If PowerShell blocks npm.ps1

Option 1 (temporary policy for current shell only):

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
npm install
npm run dev
```

Option 2 (bypass npm.ps1 using npm.cmd directly):

```powershell
& "C:\Program Files\nodejs\npm.cmd" install
& "C:\Program Files\nodejs\npm.cmd" run dev
```

## Frontend ↔ Backend API config

Frontend reads API base URL from:

- `REACT_APP_API_BASE_URL` (CRA)
- default fallback: `http://127.0.0.1:8000`

Create env file if you want to override:

```powershell
copy frontend\.env.example frontend\.env
```

Example `frontend/.env`:

```env
REACT_APP_API_BASE_URL=http://127.0.0.1:8000
```

## Demo / smoke test

- Backend health: `http://127.0.0.1:8000/health`
- Frontend app: `http://localhost:3000`

Health check via curl:

```powershell
curl http://127.0.0.1:8000/health
```

Example chat request via curl:

```powershell
curl -X POST http://127.0.0.1:8000/chat -H "Content-Type: application/json" -d '{"message":"How can I reduce monthly spending?"}'
```


## Console demo (no frontend)

1) Start backend in one terminal:

```powershell
.\.venv\Scripts\python.exe -m uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8000
```

2) Start console chat client in another terminal:

```powershell
.\.venv\Scripts\python.exe .\console_chat.py
```

The client sends `POST http://127.0.0.1:8000/chat` with JSON body `{"message":"..."}` and prints the backend reply.

Optional helper script (Windows):

```powershell
scripts\demo_console.bat
```
