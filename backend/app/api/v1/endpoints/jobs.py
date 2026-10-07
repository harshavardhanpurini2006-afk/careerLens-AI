from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.dependencies import get_db
from app.schemas.job_description import JDAnalyzeRequest, JDComparisonResponse
from app.services.jd_service import jd_service

router = APIRouter()

@router.post("/analyze")
def analyze_job_description(
    payload: JDAnalyzeRequest,
    db: Session = Depends(get_db)
):
    """
    Compares a candidate resume profile against target job description text.
    Returns matched requirements, missing critical requirements, and tailored bullet suggestions.
    """
    result = jd_service.analyze_jd(
        resume_id=str(payload.resume_id),
        jd_text=payload.get_text(),
        db=db
    )
    return result
