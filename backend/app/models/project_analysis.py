import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.db.base import Base

class ProjectAnalysis(Base):
    __tablename__ = "project_analyses"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    resume_id = Column(String(36), ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False, index=True)
    project_id = Column(String(100), nullable=True)
    project_title = Column(String(255), nullable=False)
    overall_score = Column(Integer, nullable=False)
    problem_clarity_score = Column(Integer, nullable=False)
    technical_complexity_score = Column(Integer, nullable=False)
    business_relevance_score = Column(Integer, nullable=False)
    technology_depth_score = Column(Integer, nullable=False)
    ml_ai_depth_score = Column(Integer, nullable=False)
    deployment_score = Column(Integer, nullable=False)
    testing_score = Column(Integer, nullable=False)
    documentation_score = Column(Integer, nullable=False)
    star_alignment_score = Column(Integer, nullable=False)
    star_breakdown = Column(JSON, nullable=False, default=dict)
    strengths = Column(JSON, nullable=False, default=list)
    weaknesses = Column(JSON, nullable=False, default=list)
    recruiter_questions = Column(JSON, nullable=False, default=list)
    improvement_plan = Column(JSON, nullable=False, default=list)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    resume = relationship("Resume", back_populates="project_analyses")
