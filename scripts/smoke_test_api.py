from __future__ import annotations

import sys
from pathlib import Path

from fastapi.testclient import TestClient

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from backend.app.main import app


def run() -> None:
    client = TestClient(app)

    health = client.get("/health")
    assert health.status_code == 200, health.text
    assert health.json() == {"status": "ok"}

    chat = client.post("/chat", json={"message": "Hello"})
    assert chat.status_code == 200, chat.text
    payload = chat.json()
    assert "reply" in payload and isinstance(payload["reply"], str)
    assert "meta" in payload and isinstance(payload["meta"], dict)

    print("smoke_test_api: PASS")


if __name__ == "__main__":
    run()
