from __future__ import annotations

import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

# Ensure repository root is importable when backend is launched from /backend.
REPO_ROOT = Path(__file__).resolve().parents[3]

import sys

if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from app.agent_chat import answer_user_question
from app.analytics import build_summary
from app.categorize import categorize_transactions
from app.ingest import load_transactions_as_dicts


SAMPLE_DATA_PATH = REPO_ROOT / "data" / "sample_transactions.csv"
DEFAULT_GOAL_AED = 300


@dataclass
class ConversationState:
    mode: str = "idle"
    goal_amount: int = DEFAULT_GOAL_AED
    questions_total: int = 0
    questions_asked: int = 0
    answers: dict[str, str] = field(default_factory=dict)
    last_summary_sent: str | None = None


CONVERSATION_STORE: dict[str, ConversationState] = {}

GREETING_WORDS = {"hi", "hello", "hey", "yo", "sup", "hola"}
FINANCE_KEYWORDS = ("save", "aed", "reduce spending", "budget")
ASK_QUESTIONS_RE = re.compile(r"ask me\s+(\d+)\s+questions?\s+first", re.IGNORECASE)
GOAL_AMOUNT_RE = re.compile(r"(\d+)\s*aed", re.IGNORECASE)

DEMO_QUESTIONS = [
    "Сколько у тебя реально свободных денег в конце месяца сейчас? (пример: 0–200 / 200–500 / 500+)",
    "Где проще резать без боли: подписки, кафе/доставка, шопинг, транспорт? Выбери 1–2.",
]


def build_summary_for_chat(context: dict[str, Any] | None = None) -> tuple[dict[str, Any], str]:
    context = context or {}

    if isinstance(context.get("summary"), dict):
        return context["summary"], "provided_summary"

    txs = context.get("transactions")
    if isinstance(txs, list):
        txs, _ = categorize_transactions(txs, use_llm=True)
        return build_summary(txs), "provided_transactions"

    txs = load_transactions_as_dicts(str(SAMPLE_DATA_PATH))
    txs, _ = categorize_transactions(txs, use_llm=True)
    return build_summary(txs), "sample_csv"


def _normalize(text: str) -> str:
    return re.sub(r"\s+", " ", text.strip().lower())


def _is_short_greeting(message: str) -> bool:
    norm = _normalize(message)
    cleaned = re.sub(r"[^a-z\s]", "", norm)
    tokens = [tok for tok in cleaned.split(" ") if tok]
    return bool(tokens) and len(tokens) <= 3 and all(tok in GREETING_WORDS for tok in tokens)


def _is_finance_intent(message: str) -> bool:
    norm = _normalize(message)
    return any(keyword in norm for keyword in FINANCE_KEYWORDS)


def _extract_questions_total(message: str) -> int | None:
    match = ASK_QUESTIONS_RE.search(message)
    if not match:
        return None
    return max(1, int(match.group(1)))


def _extract_goal_amount(message: str) -> int | None:
    match = GOAL_AMOUNT_RE.search(message)
    if not match:
        return None
    return int(match.group(1))


def _next_question(state: ConversationState) -> str:
    idx = state.questions_asked
    if idx < len(DEMO_QUESTIONS):
        return DEMO_QUESTIONS[idx]
    return f"Вопрос {idx + 1}: какой лимит по категории хочешь поставить? (пример: 100/200/300 AED)"


def _summary_text(summary: dict[str, Any]) -> str:
    top = (summary.get("top_categories") or [{}])[0]
    return (
        "I checked your latest spending snapshot. "
        f"Spent: {summary.get('total_spent_aed', 0):.2f} AED. "
        f"Top category: {top.get('category', 'n/a')} ({top.get('total_aed', 0):.2f} AED)."
    )


def _advice_from_answers(state: ConversationState) -> str:
    q1 = state.answers.get("q1", "").lower()
    q2 = state.answers.get("q2", "").lower()

    weekly_cap = max(50, round(state.goal_amount / 4))
    if "0-200" in q1 or "0–200" in q1:
        weekly_cap = max(40, round(state.goal_amount / 5))
    elif "500+" in q1:
        weekly_cap = max(75, round(state.goal_amount / 3.5))

    cancel_item = "одну слабополезную подписку"
    if "cafe" in q2 or "достав" in q2 or "кафе" in q2:
        cancel_item = "2 заказа доставки в неделю"
    elif "shop" in q2 or "шоп" in q2:
        cancel_item = "1 импульсную покупку каждую неделю"
    elif "transport" in q2 or "транспорт" in q2:
        cancel_item = "2 поездки такси в неделю"

    return "\n".join(
        [
            f"План на цель {state.goal_amount} AED:",
            f"• Cancel/stop: {cancel_item} уже с этой недели.",
            f"• Weekly cap: {weekly_cap} AED на категорию, где обычно перерасход.",
            "• Включи автоперевод в savings на 2 части: в начале и в середине месяца.",
            "• Раз в воскресенье сверяй фактические траты с лимитом и корректируй на следующую неделю.",
        ]
    )


def chat_with_agent(message: str, user_id: str | None = None, context: dict[str, Any] | None = None) -> dict[str, Any]:
    session_key = user_id or "default"
    state = CONVERSATION_STORE.setdefault(session_key, ConversationState())
    text = message.strip()

    summary, source = build_summary_for_chat(context)
    goal = context.get("goal_aed") if isinstance(context, dict) else None
    goal_aed = goal if isinstance(goal, int) else state.goal_amount

    extracted_goal = _extract_goal_amount(text)
    if extracted_goal:
        state.goal_amount = extracted_goal
        goal_aed = extracted_goal

    if _normalize(text) == "show summary":
        state.last_summary_sent = _summary_text(summary)
        return {
            "reply": state.last_summary_sent,
            "meta": {
                "user_id": user_id,
                "context_source": source,
                "tx_count": summary.get("tx_count", 0),
                "mode": state.mode,
            },
        }

    questions_total = _extract_questions_total(text)
    if questions_total is not None:
        state.mode = "clarify"
        state.questions_total = questions_total
        state.questions_asked = 0
        state.answers = {}
        first_question = _next_question(state)
        return {
            "reply": f"{first_question}\nПример ответа: выбери один вариант или напиши коротко своими словами.",
            "meta": {
                "user_id": user_id,
                "context_source": source,
                "tx_count": summary.get("tx_count", 0),
                "mode": state.mode,
            },
        }

    if state.mode == "clarify":
        if _is_short_greeting(text):
            pending = state.questions_asked + 1
            reminder = min(pending, state.questions_total)
            return {
                "reply": f"Я жду ответ на вопрос №{reminder}.",
                "meta": {
                    "user_id": user_id,
                    "context_source": source,
                    "tx_count": summary.get("tx_count", 0),
                    "mode": state.mode,
                },
            }

        q_key = f"q{state.questions_asked + 1}"
        state.answers[q_key] = text
        state.questions_asked += 1

        if state.questions_asked < state.questions_total:
            question = _next_question(state)
            return {
                "reply": f"{question}\nПример ответа: выбери один вариант или напиши 1–2 категории.",
                "meta": {
                    "user_id": user_id,
                    "context_source": source,
                    "tx_count": summary.get("tx_count", 0),
                    "mode": state.mode,
                },
            }

        state.mode = "advice"
        reply = _advice_from_answers(state)
        return {
            "reply": reply,
            "meta": {
                "user_id": user_id,
                "context_source": source,
                "tx_count": summary.get("tx_count", 0),
                "mode": state.mode,
                "answers": state.answers,
            },
        }

    if _is_short_greeting(text):
        if state.mode == "advice":
            reply = "Привет, хочешь продолжить план или поставить новую цель?"
        else:
            reply = "Привет! Какую цель по сбережениям ставим в AED на этот месяц?"
        return {
            "reply": reply,
            "meta": {
                "user_id": user_id,
                "context_source": source,
                "tx_count": summary.get("tx_count", 0),
                "mode": state.mode,
            },
        }

    if _is_finance_intent(text):
        state.mode = "advice"

    summary_prefix = ""
    if state.last_summary_sent is None:
        state.last_summary_sent = _summary_text(summary)
        summary_prefix = f"{state.last_summary_sent}\n\n"

    reply = answer_user_question(summary=summary, question=message, goal_aed=goal_aed)
    return {
        "reply": f"{summary_prefix}{reply}" if summary_prefix else reply,
        "meta": {
            "user_id": user_id,
            "context_source": source,
            "tx_count": summary.get("tx_count", 0),
            "mode": state.mode,
        },
    }
