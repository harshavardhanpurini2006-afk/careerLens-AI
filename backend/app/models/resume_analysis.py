import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.db.base import Base

class ResumeAnalysis(Base):
    __tablename__ = "resume_analyses"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    resume_id = Column(String(36), ForeignKey("resumes.id", ondelete="CASCADE"), unique=True, index=True, nullable=False)
    overall_ats_score = Column(Float, nullable=False)
    formatting_score = Column(Float, nullable=False)
    section_completeness_score = Column(Float, nullable=False)
    metric_usage_score = Column(Float, nullable=False)
    keyword_density_score = Column(Float, nullable=False)
    parseability_flags = Column(JSON, nullable=False, default=dict)
    detected_sections = Column(JSON, nullable=False, default=list)
    critical_issues = Column(JSON, nullable=False, default=list)
    warnings = Column(JSON, nullable=False, default=list)
    actionable_fixes = Column(JSON, nullable=False, default=list)
    recruiter_analysis = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    resume = relationship("Resume", back_populates="analyses")
