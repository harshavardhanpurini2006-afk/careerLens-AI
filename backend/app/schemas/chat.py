from typing import Optional, List, Literal, Any
from uuid import UUID
from datetime import datetime
from pydantic import Field
from app.schemas.common import CamelModel

ContextSourceType = Literal["profile", "role_gap", "roadmap", "rag"]

class ContextSourceSchema(CamelModel):
    type: ContextSourceType
    title: str
    evidence_quote: Optional[str] = None

class ChatMessageSchema(CamelModel):
    id: str
    role: Literal["user", "assistant", "system"]
    content: str
    timestamp: str
    context_sources: Optional[List[ContextSourceSchema]] = Field(default_factory=list)

class ChatRequest(CamelModel):
    resume_id: UUID
    session_id: Optional[str] = None
    message: str = Field(..., min_length=1, max_length=5000)
    target_role: Optional[str] = None
    history: Optional[List[Any]] = None

class ChatResponse(CamelModel):
    session_id: str
    message: ChatMessageSchema
