#!/usr/bin/env python3
"""Simple console chat client for backend /chat demo."""

from __future__ import annotations

import json
import sys
from typing import Any
from urllib import error, request

CHAT_URL = "http://127.0.0.1:8000/chat"
TEXT_KEYS = ("reply", "response", "answer", "message", "text", "output")


def extract_text(payload: Any) -> str:
    if isinstance(payload, dict):
        for key in TEXT_KEYS:
            value = payload.get(key)
            if isinstance(value, str) and value.strip():
                return value
    return json.dumps(payload, ensure_ascii=False, indent=2)


def send_message(message: str) -> str:
    body = json.dumps({"message": message}).encode("utf-8")
    req = request.Request(
        CHAT_URL,
        data=body,
        method="POST",
        headers={"Content-Type": "application/json"},
    )

    with request.urlopen(req, timeout=30) as response:
        raw = response.read().decode("utf-8", errors="replace")

    try:
        payload = json.loads(raw)
    except json.JSONDecodeError:
        return raw

    return extract_text(payload)


def main() -> int:
    print("Console chat demo. Type your message and press Enter.")
    print("Type 'exit' or 'quit' to stop.")

    while True:
        try:
            user_input = input("You: ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\nBye!")
            return 0

        if not user_input:
            continue

        if user_input.lower() in {"exit", "quit"}:
            print("Bye!")
            return 0

        try:
            reply = send_message(user_input)
            print(f"Bot: {reply}")
        except error.HTTPError as exc:
            details = exc.read().decode("utf-8", errors="replace")
            print(f"HTTP error {exc.code}: {details}")
        except error.URLError as exc:
            print(f"Connection error: {exc.reason}")
        except TimeoutError:
            print("Request timed out.")
        except Exception as exc:  # noqa: BLE001
            print(f"Unexpected error: {exc}")


if __name__ == "__main__":
    sys.exit(main())
