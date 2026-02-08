# Hackathon Repo

This repository contains a Python/FastAPI backend and frontend assets.

## Backend (primary service)

The backend API lives under `backend/` and exposes:
- `GET /health`
- `POST /chat` with `{ "message": "...", "user_id": "optional" }`

### Run backend (Linux/macOS)

```bash
./scripts/run_backend.sh
```

### Run backend (Windows PowerShell)

```powershell
./scripts/run_backend.ps1
```

By default, the API runs at `http://127.0.0.1:8000`.

## Frontend (React dashboard)

The React dashboard has been isolated into `react-dashboard/` to avoid conflicts with backend/root files.

### Environment

Create a frontend env file from the example:

```bash
cp react-dashboard/.env.example react-dashboard/.env
```

`REACT_APP_API_BASE_URL` defaults to `http://127.0.0.1:8000`.

### Run frontend (Linux/macOS)

```bash
cd react-dashboard
npm install
npm run dev
```

### Run frontend (Windows CMD)

```cmd
scripts\run_frontend.cmd
```

## Existing legacy frontend folder

The existing `frontend/` static HTML/CSS/JS files are preserved and considered **legacy/deprecated**.
They are intentionally kept for reference and were not deleted to avoid destructive changes.
