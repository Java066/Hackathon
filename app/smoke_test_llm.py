from app.llm import classify_unknown_transaction_llm
import os
print("ENV provider:", os.getenv("LLM_PROVIDER"))
print("ENV key starts:", (os.getenv("LLM_API_KEY") or "")[:10])

def main():
    # Тест 1: должен отнести к food_delivery
    cat1 = classify_unknown_transaction_llm(
        merchant="Talabat",
        description="Food delivery dinner",
        amount=-65,
        currency="AED",
    )
    print("Test 1 category:", cat1)

    # Тест 2: должен отнести к transport
    cat2 = classify_unknown_transaction_llm(
        merchant="Careem",
        description="Taxi ride",
        amount=-28,
        currency="AED",
    )
    print("Test 2 category:", cat2)

    # Тест 3: неизвестный мерчант -> что-то разумное или other
    cat3 = classify_unknown_transaction_llm(
        merchant="Random Merchant XYZ",
        description="Some purchase",
        amount=-120,
        currency="AED",
    )
    print("Test 3 category:", cat3)

if __name__ == "__main__":
    main()
