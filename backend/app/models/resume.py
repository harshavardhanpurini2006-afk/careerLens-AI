import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.db.base import Base

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    original_filename = Column(String(255), nullable=False)
    stored_filename = Column(String(255), nullable=False)
    file_path = Column(String(512), nullable=False)
    file_size_bytes = Column(Integer, nullable=False)
    mime_type = Column(String(100), nullable=False)
    sha256_hash = Column(String(64), index=True, nullable=False)
    raw_text = Column(Text, nullable=True)
    clean_text = Column(Text, nullable=True)
    status = Column(String(50), index=True, default="pending", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, index=True, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    user = relationship("User", back_populates="resumes")
    versions = relationship("ResumeVersion", back_populates="resume", cascade="all, delete-orphan")
    candidate_profile = relationship("CandidateProfile", back_populates="resume", uselist=False, cascade="all, delete-orphan")
    analyses = relationship("ResumeAnalysis", back_populates="resume", cascade="all, delete-orphan")
    job_matches = relationship("JobMatch", back_populates="resume", cascade="all, delete-orphan")
    skill_gaps = relationship("SkillGap", back_populates="resume", cascade="all, delete-orphan")
    project_analyses = relationship("ProjectAnalysis", back_populates="resume", cascade="all, delete-orphan")
    roadmaps = relationship("CareerRoadmap", back_populates="resume", cascade="all, delete-orphan")
    interview_sessions = relationship("InterviewSession", back_populates="resume", cascade="all, delete-orphan")
    chat_sessions = relationship("ChatSession", back_populates="resume", cascade="all, delete-orphan")

class ResumeVersion(Base):
    __tablename__ = "resume_versions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    resume_id = Column(String(36), ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False, index=True)
    version_number = Column(Integer, default=1, nullable=False)
    parsed_content = Column(JSON, nullable=False)
    change_summary = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    resume = relationship("Resume", back_populates="versions")
