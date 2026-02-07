import os
import json
from typing import Optional

from dotenv import load_dotenv

load_dotenv()

# =========================
# Fixed category whitelist
# =========================
CATEGORIES = [
    "income",
    "groceries",
    "food_delivery",
    "transport",
    "shopping",
    "fuel",
    "utilities",
    "telecom",
    "subscriptions",
    "digital_services",
    "other",
]

# =========================
# Environment config
# =========================
DEFAULT_PROVIDER = os.getenv("LLM_PROVIDER", "openai").strip().lower()
DEFAULT_MODEL = os.getenv("LLM_MODEL", "gpt-4o-mini")
API_KEY = os.getenv("LLM_API_KEY", "")


def classify_unknown_transaction_llm(
    merchant: str,
    description: str = "",
    amount: Optional[float] = None,
    currency: str = "AED",
    provider: str = DEFAULT_PROVIDER,
    model: str = DEFAULT_MODEL,
) -> str:
    """
    LLM fallback classifier.
    Always returns ONE category from CATEGORIES.
    If anything fails → returns 'other'.
    """

    if not API_KEY:
        return "other"

    provider = (provider or DEFAULT_PROVIDER).strip().lower()

    system_prompt = (
        "You are a transaction categorization engine.\n"
        "You must choose EXACTLY ONE category from the allowed list.\n"
        "You must return ONLY valid JSON.\n"
        "No explanations. No extra text."
    )

    user_payload = {
        "merchant": merchant,
        "description": description,
        "amount": amount,
        "currency": currency,
        "allowed_categories": CATEGORIES,
        "output_format": {"category": "one_of_allowed_categories"},
    }

    user_prompt = (
        f"Allowed categories: {CATEGORIES}\n"
        f"Return ONLY JSON like: {{\"category\": \"...\"}}\n\n"
        f"Transaction:\n{json.dumps(user_payload, ensure_ascii=False)}"
    )

    try:
        # =========================
        # OpenAI (primary)
        # =========================
        if provider == "openai":
            from openai import OpenAI

            client = OpenAI(api_key=API_KEY)

            resp = client.responses.create(
                model=model,
                instructions=system_prompt,
                input=user_prompt,
                temperature=0,
            )

            text = (resp.output_text or "").strip()
            category = _extract_category_from_json(text)
            return category if category in CATEGORIES else "other"

        # =========================
        # Anthropic (optional)
        # =========================
        if provider == "anthropic":
            from anthropic import Anthropic

            client = Anthropic(api_key=API_KEY)

            resp = client.messages.create(
                model=model,
                max_tokens=60,
                temperature=0,
                system=system_prompt,
                messages=[{"role": "user", "content": user_prompt}],
            )

            text = ""
            for block in resp.content:
                if getattr(block, "type", None) == "text":
                    text += block.text

            category = _extract_category_from_json(text)
            return category if category in CATEGORIES else "other"

        return "other"

    except Exception as e:
        # Keep this print during development; remove for final demo if you want
        print("LLM ERROR:", repr(e))
        return "other"


def _extract_category_from_json(text: str) -> str:
    """
    Safely extract {"category": "..."} from model output.
    """

    if not text:
        return "other"

    text = text.strip()

    # Direct JSON
    try:
        obj = json.loads(text)
        cat = str(obj.get("category", "")).strip()
        return cat if cat else "other"
    except Exception:
        pass

    # JSON embedded in text
    try:
        start = text.find("{")
        end = text.rfind("}")
        if start != -1 and end != -1 and end > start:
            obj = json.loads(text[start:end + 1])
            cat = str(obj.get("category", "")).strip()
            return cat if cat else "other"
    except Exception:
        pass

    return "other"
