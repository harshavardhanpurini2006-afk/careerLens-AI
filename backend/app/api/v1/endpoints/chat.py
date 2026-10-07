from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.dependencies import get_db
from app.schemas.chat import ChatRequest
from app.services.chat_service import chat_service

router = APIRouter()

@router.post("")
def chat_with_copilot(
    payload: ChatRequest,
    db: Session = Depends(get_db)
):
    """
    Submits a user query to the Career AI Copilot.
    Responses are grounded in the candidate's resume, verified skill gaps, and knowledge base.
    """
    result = chat_service.process_message(
        resume_id=str(payload.resume_id),
        message_text=payload.message,
        session_id=payload.session_id,
        target_role=payload.target_role,
        db=db
    )
    return result
