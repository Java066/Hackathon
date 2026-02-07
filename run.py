from app.ingest import load_transactions_as_dicts
from app.categorize import categorize_transactions
from app.analytics import build_summary


def main():
    txs = load_transactions_as_dicts("data/sample_transactions.csv")
    txs, stats = categorize_transactions(txs, use_llm=True)

    summary = build_summary(txs)

    print("\n==========+ WHERE DID MY MONEY GO? +==========")
    print(f"Transactions: {summary['tx_count']}")
    print(f"Total spent (AED): {summary['total_spent_aed']}\n")

    print("Coverage:")
    print(f"  Total: {stats['total']}")
    print(f"  Categorized by rules: {stats['by_rules']}")
    print(f"  Categorized by LLM:   {stats['by_llm']}")
    print(f"  Other:                {stats['other']}\n")

    print("Top categories (AED):")
    for cat, amt in summary["top_categories_aed"]:
        print(f"  - {cat}: {amt}")

    print("\nTop merchants (AED):")
    for m, amt in summary["top_merchants_aed"]:
        print(f"  - {m}: {amt}")

    print("\nSubscriptions detected:")
    if summary["subscriptions"]:
        for s in summary["subscriptions"]:
            print(f"  - {s['merchant']} ~{s['approx_amount']} AED, {s['occurrences']}x, dates={s['dates']}")
    else:
        print("  (none)")

    print("\nAnomalies detected:")
    if summary["anomalies"]:
        for a in summary["anomalies"]:
            print(f"  - {a['date']} | {a['merchant']} | {a['category']} | {a['amount']} AED | {a['reason']}")
    else:
        print("  (none)")

    print("\n===========================================\n")


if __name__ == "__main__":
    main()
