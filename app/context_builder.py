from __future__ import annotations

from typing import Any, Dict, List


def _to_float(value: Any) -> float:
    try:
        return float(value)
    except (TypeError, ValueError):
        return 0.0


def _top_list(items: List, limit: int = 5) -> List[Dict[str, Any]]:
    compact: List[Dict[str, Any]] = []
    for item in items[:limit]:
        if isinstance(item, (list, tuple)) and len(item) >= 2:
            compact.append({"name": str(item[0]), "amount_aed": round(_to_float(item[1]), 2)})
    return compact


def _recurring_list(items: List[Dict[str, Any]], limit: int = 5) -> List[Dict[str, Any]]:
    compact: List[Dict[str, Any]] = []
    for item in items[:limit]:
        compact.append(
            {
                "merchant": str(item.get("merchant", "UNKNOWN")),
                "approx_amount_aed": round(_to_float(item.get("approx_amount")), 2),
                "occurrences": int(item.get("occurrences", 0) or 0),
                "dates": list(item.get("dates", [])),
            }
        )
    return compact


def build_agent_context(summary: dict) -> dict:
    """
    Reduces summary to compact, LLM-friendly context.
    """
    summary = summary or {}
    return {
        "tx_count": int(summary.get("tx_count", 0) or 0),
        "total_spent_aed": round(_to_float(summary.get("total_spent_aed")), 2),
        "top_categories_aed": _top_list(summary.get("top_categories_aed", []), limit=6),
        "top_merchants_aed": _top_list(summary.get("top_merchants_aed", []), limit=6),
        "subscriptions": _recurring_list(summary.get("subscriptions", []), limit=6),
        "recurring_bills": _recurring_list(summary.get("recurring_bills", []), limit=6),
        "anomalies": [
            {
                "date": str(a.get("date", "")),
                "merchant": str(a.get("merchant", "UNKNOWN")),
                "category": str(a.get("category", "other")),
                "amount_aed": round(_to_float(a.get("amount")), 2),
                "reason": str(a.get("reason", "")),
            }
            for a in summary.get("anomalies", [])[:6]
            if isinstance(a, dict)
        ],
    }
