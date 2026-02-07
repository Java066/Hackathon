from __future__ import annotations

from pathlib import Path
from typing import Any

# Ensure repository root is importable when backend is launched from /backend.
REPO_ROOT = Path(__file__).resolve().parents[3]

import sys

if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from app.agent_chat import answer_user_question
from app.analytics import build_summary
from app.categorize import categorize_transactions
from app.ingest import load_transactions_as_dicts


SAMPLE_DATA_PATH = REPO_ROOT / "data" / "sample_transactions.csv"


def build_summary_for_chat(context: dict[str, Any] | None = None) -> tuple[dict[str, Any], str]:
    context = context or {}

    if isinstance(context.get("summary"), dict):
        return context["summary"], "provided_summary"

    txs = context.get("transactions")
    if isinstance(txs, list):
        txs, _ = categorize_transactions(txs, use_llm=True)
        return build_summary(txs), "provided_transactions"

    txs = load_transactions_as_dicts(str(SAMPLE_DATA_PATH))
    txs, _ = categorize_transactions(txs, use_llm=True)
    return build_summary(txs), "sample_csv"


def chat_with_agent(message: str, user_id: str | None = None, context: dict[str, Any] | None = None) -> dict[str, Any]:
    summary, source = build_summary_for_chat(context)
    goal = context.get("goal_aed") if isinstance(context, dict) else None
    goal_aed = goal if isinstance(goal, int) else 300

    reply = answer_user_question(summary=summary, question=message, goal_aed=goal_aed)
    return {
        "reply": reply,
        "meta": {
            "user_id": user_id,
            "context_source": source,
            "tx_count": summary.get("tx_count", 0),
        },
    }
