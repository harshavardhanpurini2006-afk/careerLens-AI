import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Boolean, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.db.base import Base

class CandidateProfile(Base):
    __tablename__ = "candidate_profiles"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    resume_id = Column(String(36), ForeignKey("resumes.id", ondelete="CASCADE"), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, default="Not found in resume")
    phone = Column(String(100), nullable=False, default="Not found in resume")
    location = Column(String(255), nullable=False, default="Not found in resume")
    linkedin_url = Column(String(512), nullable=True)
    github_url = Column(String(512), nullable=True)
    portfolio_url = Column(String(512), nullable=True)
    executive_summary = Column(Text, nullable=False, default="")
    years_of_experience = Column(Float, default=0.0, nullable=False)
    education = Column(JSON, nullable=False, default=list)
    work_experience = Column(JSON, nullable=False, default=list)
    projects = Column(JSON, nullable=False, default=list)
    certifications = Column(JSON, nullable=False, default=list)
    achievements = Column(JSON, nullable=False, default=list)
    publications = Column(JSON, nullable=False, default=list)
    raw_skills = Column(JSON, nullable=False, default=list)
    missing_sections = Column(JSON, nullable=False, default=list)
    is_demo = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    resume = relationship("Resume", back_populates="candidate_profile")
