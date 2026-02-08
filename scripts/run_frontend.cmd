@echo off
setlocal

cd /d "%~dp0..\frontend"

if not exist node_modules (
  echo Installing frontend dependencies...
  npm install
)

echo Starting React frontend...
npm run dev
