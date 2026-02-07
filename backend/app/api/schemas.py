from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, description="User message to the finance assistant")
    user_id: str | None = Field(default=None, description="Optional user identifier")
    context: dict[str, Any] | None = Field(default=None, description="Optional summary or transactions payload")


class ChatResponse(BaseModel):
    reply: str
    meta: dict[str, Any]
