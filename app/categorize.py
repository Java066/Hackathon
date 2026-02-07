from __future__ import annotations

from typing import Dict, List, Tuple

from app.rules import categorize_by_rules, CATEGORIES
from app.llm import classify_unknown_transaction_llm


def categorize_transactions(
    txs: List[Dict],
    *,
    use_llm: bool = True,
) -> Tuple[List[Dict], Dict[str, int]]:
    """
    Adds tx["category"] for every transaction using:
      1) rules first
      2) LLM fallback for unknown (optional)

    Returns (txs, stats)
    """
    stats = {
        "total": 0,
        "by_rules": 0,
        "by_llm": 0,
        "other": 0,
    }

    for tx in txs:
        stats["total"] += 1

        merchant = (tx.get("merchant") or "").strip()
        description = (tx.get("description") or "").strip()
        amount = tx.get("amount", None)
        currency = (tx.get("currency") or "AED").strip().upper()

        cat = categorize_by_rules(merchant, description)

        if cat is not None:
            stats["by_rules"] += 1
        else:
            if use_llm:
                cat = classify_unknown_transaction_llm(
                    merchant=merchant,
                    description=description,
                    amount=amount,
                    currency=currency,
                )
                stats["by_llm"] += 1
            else:
                cat = "other"

        if cat not in CATEGORIES:
            cat = "other"

        tx["category"] = cat

        if cat == "other":
            stats["other"] += 1

    return txs, stats
