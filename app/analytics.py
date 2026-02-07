from __future__ import annotations

from collections import defaultdict
from dataclasses import dataclass, asdict
from datetime import datetime
from statistics import median
from typing import Dict, List, Tuple, Optional


def _parse_iso_date(d: str) -> Optional[datetime]:
    try:
        return datetime.strptime(d, "%Y-%m-%d")
    except Exception:
        return None


def total_spent(txs: List[Dict]) -> float:
    # expenses are negative
    return round(sum(tx["amount"] for tx in txs if float(tx.get("amount", 0)) < 0), 2)


def top_categories(txs: List[Dict], n: int = 5) -> List[Tuple[str, float]]:
    sums = defaultdict(float)
    for tx in txs:
        amt = float(tx.get("amount", 0))
        if amt < 0:
            sums[tx.get("category", "other")] += -amt  # positive spend
    ranked = sorted(sums.items(), key=lambda x: x[1], reverse=True)[:n]
    return [(k, round(v, 2)) for k, v in ranked]


def top_merchants(txs: List[Dict], n: int = 5) -> List[Tuple[str, float]]:
    sums = defaultdict(float)
    for tx in txs:
        amt = float(tx.get("amount", 0))
        if amt < 0:
            m = (tx.get("merchant") or "UNKNOWN").strip()
            sums[m] += -amt
    ranked = sorted(sums.items(), key=lambda x: x[1], reverse=True)[:n]
    return [(k, round(v, 2)) for k, v in ranked]


@dataclass
class SubscriptionHit:
    merchant: str
    approx_amount: float
    occurrences: int
    dates: List[str]


def detect_subscriptions(
    txs: List[Dict],
    *,
    min_occurrences: int = 2,
    amount_tolerance_pct: float = 0.12,   # ±12%
    min_days_between: int = 20,
    max_days_between: int = 40,
) -> List[SubscriptionHit]:
    """
    Hackathon subscription heuristic:
    - same merchant
    - similar amount (within tolerance)
    - repeats ~monthly (20–40 days between payments)
    """
    by_merchant = defaultdict(list)

    for tx in txs:
        amt = float(tx.get("amount", 0))
        if amt >= 0:
            continue
        m = (tx.get("merchant") or "").strip()
        if not m:
            continue
        dt = _parse_iso_date((tx.get("date") or "").strip())
        if not dt:
            continue
        by_merchant[m].append((dt, -amt))  # store as positive spend amount

    hits: List[SubscriptionHit] = []

    for merchant, items in by_merchant.items():
        if len(items) < min_occurrences:
            continue

        items.sort(key=lambda x: x[0])
        amounts = [a for _, a in items]
        base = median(amounts)

        # filter by amount closeness to base
        filtered = [(d, a) for d, a in items if abs(a - base) <= base * amount_tolerance_pct]

        if len(filtered) < min_occurrences:
            continue

        # check if there is at least one "monthly-ish" gap
        dates = [d for d, _ in filtered]
        gaps = [(dates[i] - dates[i - 1]).days for i in range(1, len(dates))]

        monthly_like = any(min_days_between <= g <= max_days_between for g in gaps)
        if not monthly_like:
            continue

        hits.append(
            SubscriptionHit(
                merchant=merchant,
                approx_amount=round(base, 2),
                occurrences=len(filtered),
                dates=[d.strftime("%Y-%m-%d") for d in dates],
            )
        )

    # Sort by estimated monthly amount desc
    hits.sort(key=lambda h: h.approx_amount, reverse=True)
    return hits


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
    """
    Simple anomaly rule:
    - compare each expense vs median expense in its category
    - if expense > multiplier * median AND expense >= min_amount => anomaly
    """
    # collect category expense amounts
    cat_amounts = defaultdict(list)
    for tx in txs:
        amt = float(tx.get("amount", 0))
        if amt < 0:
            cat = tx.get("category", "other")
            cat_amounts[cat].append(-amt)

    cat_medians = {cat: (median(vals) if vals else 0.0) for cat, vals in cat_amounts.items()}

    anomalies: List[AnomalyHit] = []
    for tx in txs:
        amt = float(tx.get("amount", 0))
        if amt >= 0:
            continue

        spend = -amt
        if spend < min_amount:
            continue

        cat = tx.get("category", "other")
        med = cat_medians.get(cat, 0.0)
        if med <= 0:
            continue

        if spend > multiplier * med:
            anomalies.append(
                AnomalyHit(
                    date=(tx.get("date") or ""),
                    merchant=(tx.get("merchant") or "UNKNOWN"),
                    category=cat,
                    amount=round(spend, 2),
                    reason=f"High spend vs your typical {cat} (>{multiplier:.1f}× median {med:.2f})",
                )
            )

    # sort by biggest amount
    anomalies.sort(key=lambda a: a.amount, reverse=True)
    return anomalies[:top_n]


def build_summary(txs: List[Dict]) -> Dict:
    subs = detect_subscriptions(txs)
    anom = detect_anomalies(txs)

    return {
        "total_spent_aed": total_spent(txs),
        "top_categories_aed": top_categories(txs, n=6),
        "top_merchants_aed": top_merchants(txs, n=6),
        "subscriptions": [asdict(s) for s in subs],
        "anomalies": [asdict(a) for a in anom],
        "tx_count": len(txs),
    }
