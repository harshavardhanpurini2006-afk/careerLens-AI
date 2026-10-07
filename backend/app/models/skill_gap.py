import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class SkillGap(Base):
    __tablename__ = "skill_gaps"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    resume_id = Column(String(36), ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False, index=True)
    job_role_id = Column(String(36), ForeignKey("job_roles.id", ondelete="CASCADE"), nullable=False, index=True)
    skill_id = Column(String(36), ForeignKey("skills.id", ondelete="SET NULL"), nullable=True, index=True)
    skill_name = Column(String(255), nullable=False)
    status = Column(String(50), nullable=False)  # Strong, Intermediate, Needs Improvement, Missing
    importance = Column(String(50), nullable=False)  # Critical, High, Medium
    evidence_snippet = Column(Text, nullable=True)
    source_section = Column(String(100), nullable=True)
    source_page = Column(Integer, nullable=True)
    reason = Column(Text, nullable=False)
    recommended_next_step = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    resume = relationship("Resume", back_populates="skill_gaps")
    job_role = relationship("JobRole", back_populates="skill_gaps")
