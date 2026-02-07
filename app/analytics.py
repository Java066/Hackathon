from __future__ import annotations

from collections import defaultdict
from dataclasses import asdict, dataclass
from datetime import datetime
from statistics import median
from typing import Dict, List, Optional, Tuple

SUBSCRIPTION_CATEGORIES = {"subscriptions", "digital_services"}
RECURRING_BILL_CATEGORIES = {"utilities", "telecom"}


def _parse_iso_date(d: str) -> Optional[datetime]:
    try:
        return datetime.strptime(d, "%Y-%m-%d")
    except Exception:
        return None


def _amount(tx: Dict) -> float:
    return float(tx.get("amount", 0) or 0)


def _category(tx: Dict) -> str:
    return (tx.get("category") or "other").strip().lower()


def _merchant(tx: Dict) -> str:
    return (tx.get("merchant") or "UNKNOWN").strip() or "UNKNOWN"


def _is_income(tx: Dict) -> bool:
    return _amount(tx) > 0 or _category(tx) == "income"


def _expense_transactions(txs: List[Dict]) -> List[Dict]:
    return [tx for tx in txs if _amount(tx) < 0 and not _is_income(tx)]


def total_spent(txs: List[Dict]) -> float:
    expenses = _expense_transactions(txs)
    return round(sum(-_amount(tx) for tx in expenses), 2)


def top_categories(txs: List[Dict], n: int = 5) -> List[Tuple[str, float]]:
    sums = defaultdict(float)
    for tx in _expense_transactions(txs):
        sums[_category(tx)] += -_amount(tx)

    ranked = sorted(sums.items(), key=lambda x: x[1], reverse=True)[:n]
    return [(cat, round(amount, 2)) for cat, amount in ranked]


def top_merchants(txs: List[Dict], n: int = 5) -> List[Tuple[str, float]]:
    sums = defaultdict(float)
    for tx in _expense_transactions(txs):
        sums[_merchant(tx)] += -_amount(tx)

    ranked = sorted(sums.items(), key=lambda x: x[1], reverse=True)[:n]
    return [(merchant, round(amount, 2)) for merchant, amount in ranked]


@dataclass
class RecurringHit:
    merchant: str
    approx_amount: float
    occurrences: int
    dates: List[str]


def _detect_recurring_by_categories(
    txs: List[Dict],
    *,
    allowed_categories: set[str],
    min_occurrences: int = 2,
    amount_tolerance_pct: float = 0.12,
    min_days_between: int = 20,
    max_days_between: int = 40,
) -> List[RecurringHit]:
    by_merchant = defaultdict(list)

    for tx in _expense_transactions(txs):
        if _category(tx) not in allowed_categories:
            continue

        dt = _parse_iso_date((tx.get("date") or "").strip())
        if not dt:
            continue

        by_merchant[_merchant(tx)].append((dt, -_amount(tx)))

    hits: List[RecurringHit] = []
    for merchant, items in by_merchant.items():
        if len(items) < min_occurrences:
            continue

        items.sort(key=lambda x: x[0])
        amounts = [amount for _, amount in items]
        base = median(amounts)

        if base <= 0:
            continue

        filtered = [
            (date, amount)
            for date, amount in items
            if abs(amount - base) <= base * amount_tolerance_pct
        ]
        if len(filtered) < min_occurrences:
            continue

        dates = [date for date, _ in filtered]
        gaps = [(dates[i] - dates[i - 1]).days for i in range(1, len(dates))]
        has_monthly_gap = any(min_days_between <= gap <= max_days_between for gap in gaps)
        if not has_monthly_gap:
            continue

        hits.append(
            RecurringHit(
                merchant=merchant,
                approx_amount=round(base, 2),
                occurrences=len(filtered),
                dates=[date.strftime("%Y-%m-%d") for date in dates],
            )
        )

    hits.sort(key=lambda h: h.approx_amount, reverse=True)
    return hits


def detect_subscriptions(txs: List[Dict]) -> List[RecurringHit]:
    return _detect_recurring_by_categories(txs, allowed_categories=SUBSCRIPTION_CATEGORIES)


def detect_recurring_bills(txs: List[Dict]) -> List[RecurringHit]:
    return _detect_recurring_by_categories(txs, allowed_categories=RECURRING_BILL_CATEGORIES)


@dataclass
class AnomalyHit:
    date: str
    merchant: str
    category: str
    amount: float
    reason: str


def detect_anomalies(
    txs: List[Dict],
    *,
    multiplier: float = 2.0,
    min_amount: float = 150.0,
    top_n: int = 5,
) -> List[AnomalyHit]:
    category_amounts = defaultdict(list)
    expenses = _expense_transactions(txs)

    for tx in expenses:
        category_amounts[_category(tx)].append(-_amount(tx))

    category_medians = {
        cat: median(amounts)
        for cat, amounts in category_amounts.items()
        if len(amounts) >= 3
    }

    anomalies: List[AnomalyHit] = []
    for tx in expenses:
        spend = -_amount(tx)
        if spend < min_amount:
            continue

        cat = _category(tx)
        cat_median = category_medians.get(cat)
        if cat_median is None:
            continue

        if spend > multiplier * cat_median:
            anomalies.append(
                AnomalyHit(
                    date=(tx.get("date") or ""),
                    merchant=_merchant(tx),
                    category=cat,
                    amount=round(spend, 2),
                    reason=(
                        f"High spend vs your typical {cat} "
                        f"(>{multiplier:.1f}× median {cat_median:.2f})"
                    ),
                )
            )

    anomalies.sort(key=lambda a: a.amount, reverse=True)
    return anomalies[:top_n]


def build_summary(txs: List[Dict]) -> Dict:
    subscriptions = detect_subscriptions(txs)
    recurring_bills = detect_recurring_bills(txs)
    anomalies = detect_anomalies(txs)

    return {
        "tx_count": len(txs),
        "total_spent_aed": total_spent(txs),
        "top_categories_aed": top_categories(txs, n=6),
        "top_merchants_aed": top_merchants(txs, n=6),
        "subscriptions": [asdict(hit) for hit in subscriptions],
        "recurring_bills": [asdict(hit) for hit in recurring_bills],
        "anomalies": [asdict(hit) for hit in anomalies],
    }
