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

    lines = ["AI analysis unavailable; this is a rule-based insight."]

    if any(term in q for term in ["rent", "mortgage", "loan"]):
        lines.append("I do not have enough information to identify a dedicated rent/mortgage amount in your current summary.")
        lines.append("Could you clarify which merchant or category represents rent in your data?")
        return "\n".join(lines)

    if "suspicious" in q or "anomal" in q:
        if anomalies:
            top = anomalies[0]
            lines.append(
                f"Direct answer: You have {len(anomalies)} flagged anomaly/anomalies, with the largest at "
                f"{top['amount_aed']:.2f} AED ({top['merchant']}, {top['category']})."
            )
            lines.append("What I see: anomalies are already filtered from computed category medians and minimum amount threshold.")
        else:
            lines.append("Direct answer: No suspicious spending is currently flagged in the summary.")
            lines.append("What I see: the anomalies list is empty.")
    elif "save" in q or "cut" in q or "reduce" in q:
        biggest_cat = top_categories[0] if top_categories else {"name": "other", "amount_aed": 0.0}
        lines.append(
            f"Direct answer: To target a savings goal of {goal:.2f} AED, focus first on your largest spend bucket "
            f"({biggest_cat['name']}: {biggest_cat['amount_aed']:.2f} AED)."
        )
        lines.append(f"What I see: total spend is {total_spent:.2f} AED in the current computed period.")
    elif "most" in q and "money" in q or "where" in q and "go" in q:
        biggest_cat = top_categories[0] if top_categories else {"name": "other", "amount_aed": 0.0}
        biggest_merch = top_merchants[0] if top_merchants else {"name": "UNKNOWN", "amount_aed": 0.0}
        lines.append(
            f"Direct answer: Most of your money went to {biggest_cat['name']} ({biggest_cat['amount_aed']:.2f} AED)."
        )
        lines.append(
            f"What I see: top merchant spend is {biggest_merch['name']} at {biggest_merch['amount_aed']:.2f} AED."
        )
    else:
        lines.append("Direct answer: I can help based on totals, top categories/merchants, recurring items, and anomalies in your summary.")
        lines.append(
            f"What I see: total spend {total_spent:.2f} AED, "
            f"{len(context.get('subscriptions', []))} subscription(s), "
            f"{len(context.get('recurring_bills', []))} recurring bill(s)."
        )

    lines.append("Actions:")
    lines.append("1) Reduce one high-spend category by 10–15% this month.")
    lines.append("2) Review recurring items and cancel at least one low-value service.")
    lines.append(f"3) Set a weekly cap to stay on track for {goal:.2f} AED monthly savings.")
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
        "You are a careful financial assistant with an accountant mindset.\n"
        "Rules:\n"
        "- You MUST use only the provided data context.\n"
        "- You MUST NOT invent numbers, merchants, dates, or trends.\n"
        "- If the user asks something not present in the data, say you do not have enough information and ask ONE clarifying question.\n"
        "- Every answer must include:\n"
        "  1) A direct answer\n"
        "  2) What you see in the data (facts)\n"
        "  3) 2–3 concrete, actionable steps\n"
        "- Use AED currency.\n"
        "- Keep responses concise and demo-friendly.\n"
        "- If calculations are made, briefly explain them."
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
        "- If unsure, say so"
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
