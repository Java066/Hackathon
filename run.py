from app.analytics import build_summary
from app.categorize import categorize_transactions
from app.ingest import load_transactions_as_dicts


def _print_recurring_section(title: str, items: list[dict]) -> None:
    print(f"\n{title}:")
    if not items:
        print("  (none)")
        return

    for item in items:
        dates = ", ".join(item["dates"])
        print(
            f"  - {item['merchant']} ~{item['approx_amount']:.2f} AED "
            f"({item['occurrences']}x) | dates: {dates}"
        )


def main() -> None:
    txs = load_transactions_as_dicts("data/sample_transactions.csv")
    txs, stats = categorize_transactions(txs, use_llm=True)
    summary = build_summary(txs)

    print("\n==========+ WHERE DID MY MONEY GO? +==========")
    print(f"Transactions: {summary['tx_count']}")
    print(f"Total spent: {summary['total_spent_aed']:.2f} AED\n")

    print("Coverage:")
    print(f"  Total: {stats['total']}")
    print(f"  Categorized by rules: {stats['by_rules']}")
    print(f"  Categorized by LLM:   {stats['by_llm']}")
    print(f"  Other:                {stats['other']}\n")

    print("Top categories (AED):")
    for category, amount in summary["top_categories_aed"]:
        print(f"  - {category}: {amount:.2f}")

    print("\nTop merchants (AED):")
    for merchant, amount in summary["top_merchants_aed"]:
        print(f"  - {merchant}: {amount:.2f}")

    _print_recurring_section("Subscriptions", summary["subscriptions"])
    _print_recurring_section("Recurring bills", summary["recurring_bills"])

    print("\nAnomalies detected:")
    if summary["anomalies"]:
        for anomaly in summary["anomalies"]:
            print(
                "  - "
                f"{anomaly['date']} | {anomaly['merchant']} | {anomaly['category']} "
                f"| {anomaly['amount']:.2f} AED | {anomaly['reason']}"
            )
    else:
        print("  (none)")

    print("\n===========================================\n")


if __name__ == "__main__":
    main()
