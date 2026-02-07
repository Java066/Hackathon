from __future__ import annotations

import csv
from dataclasses import dataclass, asdict
from datetime import datetime
from typing import List, Optional


@dataclass
class Transaction:
    date: str              # keep as ISO string "YYYY-MM-DD" for simplicity
    amount: float
    currency: str
    merchant: str
    description: str

    # later you can add: category: str | None = None


def _parse_date(value: str) -> str:
    """
    Accepts 'YYYY-MM-DD' (recommended). Returns ISO date string.
    If parsing fails, returns the raw trimmed value (so you don't crash in MVP).
    """
    v = (value or "").strip()
    if not v:
        return ""
    try:
        # If you always use YYYY-MM-DD in your CSV, this will succeed
        dt = datetime.strptime(v, "%Y-%m-%d").date()
        return dt.isoformat()
    except Exception:
        return v


def _parse_amount(value: str) -> float:
    """
    Handles amounts like '-65', '-65.00', ' -65 ', or 'AED -65' (best effort).
    """
    v = (value or "").strip()
    if not v:
        return 0.0

    # remove currency text if someone included it
    v = v.replace("AED", "").replace(",", "").strip()

    try:
        return float(v)
    except Exception:
        # last resort: keep only digits, minus, dot
        cleaned = "".join(ch for ch in v if ch.isdigit() or ch in ".-")
        try:
            return float(cleaned) if cleaned else 0.0
        except Exception:
            return 0.0


def load_transactions_csv(path: str) -> List[Transaction]:
    """
    Reads the CSV and returns a list of Transaction objects.
    Expected columns:
      date, amount, currency, merchant, description
    """
    txs: List[Transaction] = []

    with open(path, "r", encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)

        required = {"date", "amount", "currency", "merchant", "description"}
        headers = set(h.strip() for h in (reader.fieldnames or []))
        missing = required - headers
        if missing:
            raise ValueError(f"CSV missing required columns: {sorted(missing)}. Found: {sorted(headers)}")

        for i, row in enumerate(reader, start=2):  # start=2 because header is line 1
            date = _parse_date(row.get("date", ""))
            amount = _parse_amount(row.get("amount", ""))
            currency = (row.get("currency", "") or "AED").strip().upper()
            merchant = (row.get("merchant", "") or "").strip()
            description = (row.get("description", "") or "").strip()

            # minimal sanity checks (don’t crash MVP on bad rows)
            if not merchant and not description:
                # skip totally empty rows
                continue

            txs.append(
                Transaction(
                    date=date,
                    amount=amount,
                    currency=currency,
                    merchant=merchant,
                    description=description,
                )
            )

    return txs


def load_transactions_as_dicts(path: str) -> List[dict]:
    """
    Convenience wrapper: returns list[dict] instead of dataclass objects.
    """
    return [asdict(t) for t in load_transactions_csv(path)]
