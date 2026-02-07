# GitHub Copilot instructions for this repository

Purpose
- Help AI coding agents become productive quickly when working on this repository.

Current repo state
- This repository currently contains no source files at the project root. A local setup helper exists at `/Users/ahmedzk11/Downloads/setup-structure.sh` (user workspace). Agents should not assume language, build system, or test harness until files are present.

Immediate discovery steps (do these first)
- Run a workspace file search for README and common project files:
  - `git ls-files || true`
  - `find . -maxdepth 4 -type f -name README.md -o -name package.json -o -name pyproject.toml -o -name go.mod`
- If the workspace is empty, ask the user where the project sources are or whether to run the provided setup script.
- If given permission, inspect and, if safe, run `/Users/ahmedzk11/Downloads/setup-structure.sh` to populate the repository scaffold. Run in a local shell and report output before making edits.

How to infer architecture once files exist
- Identify top-level language indicators: `package.json` (Node), `pyproject.toml` / `requirements.txt` (Python), `go.mod` (Go), `Cargo.toml` (Rust).
- Locate entry points: `src/`, `cmd/`, `main.go`, `server.js`, `app.py`, or `index.ts`.
- Read configuration and infra files: `.github/workflows/*`, `Dockerfile`, `docker-compose.yml` to understand CI and runtime.

Project-specific conventions (currently discoverable)
- No conventions are detectable until code is present. When code appears, document any recurring patterns (naming, module layout, tests location) in a short summary and update this file.

Developer workflows to surface to the user
- If a build/test command appears (e.g., `npm test`, `pytest`, `go test`), add it here.
- For now, before running any build/test step, ask the user for permission and the preferred environment (macOS, Linux container, or CI).

Safety and change policy
- Do not create or modify production configuration or CI workflows without explicit user approval.
- When proposing code changes, include a concise plan and a single, minimal patch. Run tests locally when available before marking work complete.

Examples for agents (commands to run during discovery)
- `find . -maxdepth 3 -type f -name "*.py" -o -name "*.js" -o -name "*.ts" -o -name "*.go"`
- `git status --porcelain` and `git rev-parse --show-toplevel`
- Inspect the user's provided setup script before running: `sed -n '1,200p' /Users/ahmedzk11/Downloads/setup-structure.sh`

When to escalate to the human
- If the repository remains empty after discovery, ask the user where sources live.
- If running the setup script would change many files or create credentials, request explicit approval and a brief description of intended changes.

Maintenance
- Keep this file short and concrete. Update when new project structure is added or when you learn a recurring pattern.

Feedback
- After following these steps, ask the user what additional context or files you should prioritize.
