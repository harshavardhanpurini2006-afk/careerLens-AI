import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.db.base import Base

class JobMatch(Base):
    __tablename__ = "job_matches"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    resume_id = Column(String(36), ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False, index=True)
    job_role_id = Column(String(36), ForeignKey("job_roles.id", ondelete="CASCADE"), nullable=True, index=True)
    job_description_id = Column(String(36), ForeignKey("job_descriptions.id", ondelete="CASCADE"), nullable=True, index=True)
    deterministic_score = Column(Float, nullable=False)
    required_skill_coverage = Column(Float, nullable=False)
    preferred_skill_coverage = Column(Float, nullable=False)
    project_relevance_score = Column(Float, nullable=False)
    experience_relevance_score = Column(Float, nullable=False)
    keyword_score = Column(Float, nullable=False)
    matched_skills = Column(JSON, nullable=False, default=list)
    missing_skills = Column(JSON, nullable=False, default=list)
    recruiter_signals = Column(JSON, nullable=False, default=list)
    recruiter_concerns = Column(JSON, nullable=False, default=list)
    ai_explanation = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    resume = relationship("Resume", back_populates="job_matches")
    job_role = relationship("JobRole", back_populates="job_matches")
    job_description = relationship("JobDescription", back_populates="job_matches")
