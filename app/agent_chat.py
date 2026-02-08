from __future__ import annotations

import json
import os
from typing import Any, Dict, Optional

from dotenv import load_dotenv

from app.context_builder import build_agent_context

load_dotenv()


def _to_float(value: Any) -> float:
    try:
        return float(value)
    except (TypeError, ValueError):
        return 0.0


def _fallback_answer(summary: Dict, question: str, goal_aed: Optional[int]) -> str:
    context = build_agent_context(summary)
    q = (question or "").strip().lower()
    goal = goal_aed if goal_aed is not None else 300

    total_spent = _to_float(context.get("total_spent_aed"))
    top_categories = context.get("top_categories_aed", [])
    top_merchants = context.get("top_merchants_aed", [])
    anomalies = context.get("anomalies", [])

    lines = ["Got it — I checked your latest spending snapshot."]

    if any(term in q for term in ["rent", "mortgage", "loan"]):
        lines.append("I can’t see a clearly labeled rent or mortgage payment yet.")
        lines.append("• Share which merchant or category is your housing cost")
        lines.append("• I can estimate a monthly housing target once that’s identified")
        lines.append("• Then we can build a realistic savings plan around it")
        lines.append("Which transaction should I treat as your rent or mortgage?")
        return "\n".join(lines)

    if "suspicious" in q or "anomal" in q:
        if anomalies:
            top = anomalies[0]
            lines.append(
                f"You have {len(anomalies)} unusual charge(s), and the biggest one is {top['amount_aed']:.2f} AED at {top['merchant']}."
            )
        else:
            lines.append("Good news: there are no unusual charges flagged right now.")
    elif "save" in q or "cut" in q or "reduce" in q:
        biggest_cat = top_categories[0] if top_categories else {"name": "other", "amount_aed": 0.0}
        lines.append(
            f"Your fastest savings win is trimming {biggest_cat['name']}, where you spent {biggest_cat['amount_aed']:.2f} AED."
        )
    elif "most" in q and "money" in q or "where" in q and "go" in q:
        biggest_cat = top_categories[0] if top_categories else {"name": "other", "amount_aed": 0.0}
        biggest_merch = top_merchants[0] if top_merchants else {"name": "UNKNOWN", "amount_aed": 0.0}
        lines.append(
            f"Most of your money is going to {biggest_cat['name']} ({biggest_cat['amount_aed']:.2f} AED), with {biggest_merch['name']} leading among merchants."
        )
    else:
        lines.append(
            f"You’ve spent {total_spent:.2f} AED so far, with {len(context.get('subscriptions', []))} subscription(s) and {len(context.get('recurring_bills', []))} recurring bill(s) to optimize."
        )

    lines.append("• Trim one high-spend category by 10–15% this month")
    lines.append("• Cancel one low-value recurring charge")
    lines.append(f"• Set a weekly cap to stay on track for {goal:.2f} AED in monthly savings")
    lines.append("Would you like me to suggest the easiest cut to start with?")
    return "\n".join(lines)


def answer_user_question(
    summary: dict,
    question: str,
    goal_aed: int | None = 300,
) -> str:
    """
    Answers a free-form user question grounded strictly in computed summary data.
    """
    api_key = os.getenv("LLM_API_KEY", "").strip()
    model = os.getenv("LLM_MODEL", "gpt-4o-mini").strip()

    context = build_agent_context(summary or {})

    if not api_key:
        return _fallback_answer(summary or {}, question, goal_aed)

    system_prompt = (
        "You are a friendly, confident financial assistant for a live demo.\n"
        "Hard rules:\n"
        "- Use only the provided data context.\n"
        "- Never invent numbers, merchants, dates, or trends.\n"
        "- Keep replies concise and natural, as if spoken aloud.\n"
        "- Use simple plain English with AED currency.\n"
        "- Never use technical or meta wording.\n"
        "- Never use these phrases: 'rule-based', 'direct answer', 'computed period', 'analysis shows'.\n"
        "- If data is missing, say that briefly and ask one clarifying question.\n"
        "Response format is mandatory for every reply:\n"
        "1) One short acknowledgment sentence\n"
        "2) One key insight sentence\n"
        "3) 2–3 actionable suggestions as bullet points using '•'\n"
        "4) End with one follow-up question about what to do next"
    )

    goal_text = goal_aed if goal_aed is not None else 300
    user_prompt = (
        "DATA CONTEXT (authoritative JSON):\n"
        f"{json.dumps(context, ensure_ascii=False)}\n\n"
        "USER QUESTION:\n"
        f"{question}\n\n"
        "USER GOAL:\n"
        f"Save {goal_text} AED per month\n\n"
        "OUTPUT RULES:\n"
        "- Do not output JSON\n"
        "- Do not invent facts\n"
        "- If unsure, say so briefly\n"
        "- Follow the 4-part response format exactly\n"
        "- End with a follow-up question"
    )

    try:
        from openai import OpenAI

        client = OpenAI(api_key=api_key)
        resp = client.responses.create(
            model=model,
            instructions=system_prompt,
            input=user_prompt,
            temperature=0,
            max_output_tokens=300,
        )

        text = (resp.output_text or "").strip()
        if not text:
            return _fallback_answer(summary or {}, question, goal_aed)
        return text
    except Exception:
        return _fallback_answer(summary or {}, question, goal_aed)
