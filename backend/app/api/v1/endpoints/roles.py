from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.dependencies import get_db
from app.models.job_role import JobRole

router = APIRouter()

@router.get("")
def get_all_roles(db: Session = Depends(get_db)):
    """
    Returns all 11 active canonical job roles.
    """
    roles = db.query(JobRole).filter_by(is_active=True).all()
    results = []
    for r in roles:
        results.append({
            "id": r.id,
            "roleCode": r.role_code,
            "displayName": r.display_name,
            "category": r.category,
            "description": r.description,
            "experienceExpectations": r.experience_expectations,
            "commonTools": r.common_tools,
            "projectExpectations": r.project_expectations,
            "interviewTopics": r.interview_topics,
            "requiredSkills": r.required_skills,
            "preferredSkills": r.preferred_skills,
        })
    return results
