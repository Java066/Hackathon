@echo off
setlocal

set PYTHON=.\.venv\Scripts\python.exe

if not exist "%PYTHON%" (
  echo [ERROR] Python executable not found: %PYTHON%
  echo Please create the venv first or update PYTHON in this script.
  exit /b 1
)

echo Starting backend in a new window...
start "Hackathon Backend" cmd /k "%PYTHON% -m uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8000"

echo Launching console chat in this window...
"%PYTHON%" console_chat.py
