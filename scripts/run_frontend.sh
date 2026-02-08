#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/../frontend"

if [ ! -d node_modules ]; then
  echo "Installing frontend dependencies..."
  npm install
fi

echo "Starting React frontend..."
npm run dev
