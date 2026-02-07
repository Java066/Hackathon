import re
from typing import Optional

# Fixed category list (use these exact strings everywhere)
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

# Compiled regex patterns -> category
# Order matters: first match wins.
_RULES = [
    # Income
    (re.compile(r"\bSALARY\b|\bPAYROLL\b", re.IGNORECASE), "income"),

    # Groceries
    (re.compile(
        r"\bCARREFOUR\b|\bLULU\b|\bSPINNEYS\b|\bWAITROSE\b|\bUNION\s*COOP\b|\bCHOITHRAMS\b|\bAL\s*MADINA\b",
        re.IGNORECASE
    ), "groceries"),

    # Food delivery / restaurants
    (re.compile(
        r"\bTALABAT\b|\bDELIVEROO\b|\bNOON\s*FOOD\b|\bZOMATO\b|\bUBER\s*EATS\b",
        re.IGNORECASE
    ), "food_delivery"),

    # Transport / ride hailing / public transport / parking
    (re.compile(
        r"\bCAREEM\b|\bUBER\b|\bBOLT\b|\bRTA\b|\bMETRO\b|\bTRAM\b|\bPARKING\b|\bSALIK\b",
        re.IGNORECASE
    ), "transport"),

    # Shopping / e-commerce / retail (non-grocery)
    (re.compile(
        r"\bAMAZON\b|\bNOON\b|\bSHEIN\b|\bALIEXPRESS\b|\bNAMSHI\b|\bMAX\b|\bCENTREPOINT\b",
        re.IGNORECASE
    ), "shopping"),

    # Fuel
    (re.compile(r"\bENOC\b|\bADNOC\b|\bEMARAT\b", re.IGNORECASE), "fuel"),

    # Utilities
    (re.compile(r"\bDEWA\b|\bSEWA\b|\bADDC\b|\bFEWA\b", re.IGNORECASE), "utilities"),

    # Telecom
    (re.compile(r"\bETISALAT\b|\bDU\b|\bVIRGIN\s*MOBILE\b", re.IGNORECASE), "telecom"),

    # Subscriptions (media + cloud bundles)
    (re.compile(
        r"\bNETFLIX\b|\bSPOTIFY\b|\bANGHAMI\b|\bYOUTUBE\s*PREMIUM\b|\bOSN\b|\bDISNEY\+\b",
        re.IGNORECASE
    ), "subscriptions"),
    (re.compile(
        r"\bICLOUD\b|\bGOOGLE\s*ONE\b|\bMICROSOFT\s*365\b|\bOFFICE\s*365\b",
        re.IGNORECASE
    ), "subscriptions"),

    # Digital services (general SaaS / dev / infra)
    (re.compile(
        r"\bGOOGLE\b|\bICLOUD\b|\bDROPBOX\b|\bMICROSOFT\b|\bAWS\b|\bGITHUB\b",
        re.IGNORECASE
    ), "digital_services"),
    (re.compile(
        r"\bAPPLE\b|\bAPP\s*STORE\b|\bITUNES\b",
        re.IGNORECASE
    ), "digital_services"),
]


def normalize_merchant(raw: str) -> str:
    """
    Normalize merchant string to improve matching.
    Keeps it simple for MVP.
    """
    if not raw:
        return ""

    s = raw.strip()

    # Collapse whitespace
    s = re.sub(r"\s+", " ", s)

    # Remove common suffix noise (optional)
    s = re.sub(
        r"\b(LLC|L\.L\.C|LTD|FZCO|FZ-LLC|FZE|PJSC|CO\.|COMPANY)\b",
        "",
        s,
        flags=re.IGNORECASE,
    )

    # Remove extra punctuation except spaces
    s = re.sub(r"[^\w\s]", " ", s)

    # Collapse again
    s = re.sub(r"\s+", " ", s).strip()

    return s


def categorize_by_rules(merchant: str, description: str = "") -> Optional[str]:
    """
    Returns a category string if matched, else None.
    """
    m = normalize_merchant(merchant)
    d = (description or "").strip()

    # For matching we combine merchant + description
    text = f"{m} {d}".strip()

    for pattern, category in _RULES:
        if pattern.search(text):
            return category

    return None
