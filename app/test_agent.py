from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from app.agent_chat import answer_user_question
from app.analytics import build_summary
from app.categorize import categorize_transactions
from app.ingest import load_transactions_as_dicts


def main() -> None:
    txs = load_transactions_as_dicts("data/sample_transactions.csv")
    txs, _ = categorize_transactions(txs)
    summary = build_summary(txs)

    while True:
        q = input("Ask: ").strip()
        if q.lower() in {"exit", "quit"}:
            break
        print(answer_user_question(summary, q))


if __name__ == "__main__":
    main()
