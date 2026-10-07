import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.db.base import Base

class JobDescription(Base):
    __tablename__ = "job_descriptions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    resume_id = Column(String(36), ForeignKey("resumes.id", ondelete="SET NULL"), nullable=True, index=True)
    title = Column(String(255), nullable=True)
    company = Column(String(255), nullable=True)
    raw_text = Column(Text, nullable=False)
    extracted_role = Column(String(255), nullable=True)
    extracted_seniority = Column(String(100), nullable=True)
    extracted_skills = Column(JSON, nullable=True)
    embedding = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="job_descriptions")
    job_matches = relationship("JobMatch", back_populates="job_description", cascade="all, delete-orphan")
