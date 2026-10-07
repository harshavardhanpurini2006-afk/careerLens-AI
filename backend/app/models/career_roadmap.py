import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.db.base import Base

class CareerRoadmap(Base):
    __tablename__ = "career_roadmaps"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    resume_id = Column(String(36), ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False, index=True)
    target_role_id = Column(String(36), ForeignKey("job_roles.id", ondelete="SET NULL"), nullable=True, index=True)
    target_role_code = Column(String(100), nullable=False)
    title = Column(String(255), nullable=False)
    duration_weeks = Column(Integer, default=10, nullable=False)
    current_state_summary = Column(Text, nullable=False)
    immediate_priorities = Column(JSON, nullable=False, default=list)
    milestones = Column(JSON, nullable=False, default=list)
    recommended_projects = Column(JSON, nullable=False, default=list)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    resume = relationship("Resume", back_populates="roadmaps")
    target_role = relationship("JobRole")
