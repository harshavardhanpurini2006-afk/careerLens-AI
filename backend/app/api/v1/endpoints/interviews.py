from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.dependencies import get_db
from app.models.interview import InterviewSession
from app.schemas.interview import (
    InterviewStartRequest,
    InterviewAnswerRequest,
)
from app.services.interview_service import interview_service
from app.core.errors import NotFoundException

router = APIRouter()

@router.post("/start")
def start_interview(
    payload: InterviewStartRequest,
    db: Session = Depends(get_db)
):
    """
    Starts an interview simulation session with resume-grounded questions.
    """
    session = interview_service.start_session(
        resume_id=str(payload.resume_id),
        target_role=payload.get_role(),
        interview_type=payload.interview_type,
        difficulty=payload.difficulty,
        db=db
    )

    questions_out = []
    for q in session.questions:
        questions_out.append({
            "id": q.id,
            "orderIndex": q.order_index,
            "questionText": q.question_text,
            "category": q.category,
            "difficulty": q.difficulty,
            "sourceContext": q.source_context,
            "expectedKeyPoints": q.expected_key_points,
        })

    return {
        "id": session.id,
        "resumeId": session.resume_id,
        "targetRole": session.target_role_name,
        "interviewType": session.interview_type,
        "difficulty": session.difficulty,
        "questions": questions_out,
        "evaluations": {},
        "overallScore": session.overall_score,
        "feedbackSummary": session.feedback_summary,
        "status": session.status,
    }

@router.get("/{session_id}")
def get_interview_session(session_id: str, db: Session = Depends(get_db)):
    """Retrieves an existing interview session."""
    session = db.query(InterviewSession).filter_by(id=session_id).first()
    if not session:
        raise NotFoundException("InterviewSession", session_id)

    evals = {}
    for q in session.questions:
        if q.answer:
            a = q.answer
            evals[q.id] = {
                "questionId": q.id,
                "candidateAnswer": a.candidate_answer,
                "technicalAccuracyScore": a.technical_accuracy_score,
                "clarityScore": a.clarity_score,
                "completenessScore": a.completeness_score,
                "projectUnderstandingScore": a.project_understanding_score,
                "conciseFeedback": a.concise_feedback,
                "strengths": a.strengths,
                "improvementTips": a.improvement_tips,
                "recruiterFollowUp": a.recruiter_follow_up,
            }

    questions_out = []
    for q in session.questions:
        questions_out.append({
            "id": q.id,
            "orderIndex": q.order_index,
            "questionText": q.question_text,
            "category": q.category,
            "difficulty": q.difficulty,
            "sourceContext": q.source_context,
            "expectedKeyPoints": q.expected_key_points,
        })

    return {
        "id": session.id,
        "resumeId": session.resume_id,
        "targetRole": session.target_role_name,
        "interviewType": session.interview_type,
        "difficulty": session.difficulty,
        "questions": questions_out,
        "evaluations": evals,
        "overallScore": session.overall_score,
        "feedbackSummary": session.feedback_summary,
        "status": session.status,
    }

@router.post("/{session_id}/answer")
def submit_interview_answer(
    session_id: str,
    payload: InterviewAnswerRequest,
    db: Session = Depends(get_db)
):
    """
    Submits a candidate answer for rubric evaluation.
    """
    eval_res = interview_service.evaluate_answer(
        question_id=payload.question_id,
        candidate_answer=payload.candidate_answer,
        db=db
    )

    return {
        "questionId": eval_res.question_id,
        "candidateAnswer": eval_res.candidate_answer,
        "technicalAccuracyScore": eval_res.technical_accuracy_score,
        "clarityScore": eval_res.clarity_score,
        "completenessScore": eval_res.completeness_score,
        "projectUnderstandingScore": eval_res.project_understanding_score,
        "conciseFeedback": eval_res.concise_feedback,
        "strengths": eval_res.strengths,
        "improvementTips": eval_res.improvement_tips,
        "recruiterFollowUp": eval_res.recruiter_follow_up,
    }
