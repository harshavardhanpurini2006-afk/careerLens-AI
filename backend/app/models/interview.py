import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.db.base import Base

class InterviewSession(Base):
    __tablename__ = "interview_sessions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    resume_id = Column(String(36), ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False, index=True)
    target_role_id = Column(String(36), ForeignKey("job_roles.id", ondelete="SET NULL"), nullable=True, index=True)
    target_role_name = Column(String(255), nullable=False)
    interview_type = Column(String(50), nullable=False)
    difficulty = Column(String(50), nullable=False)
    overall_score = Column(Integer, nullable=True)
    feedback_summary = Column(Text, nullable=True)
    status = Column(String(50), default="in_progress", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    resume = relationship("Resume", back_populates="interview_sessions")
    target_role = relationship("JobRole")
    questions = relationship("InterviewQuestion", back_populates="session", cascade="all, delete-orphan", order_by="InterviewQuestion.order_index")

class InterviewQuestion(Base):
    __tablename__ = "interview_questions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(String(36), ForeignKey("interview_sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    order_index = Column(Integer, nullable=False)
    question_text = Column(Text, nullable=False)
    category = Column(String(100), nullable=False)
    difficulty = Column(String(50), nullable=False)
    source_context = Column(JSON, nullable=False, default=dict)
    expected_key_points = Column(JSON, nullable=False, default=list)
    rubric = Column(JSON, nullable=True)

    session = relationship("InterviewSession", back_populates="questions")
    answer = relationship("InterviewAnswer", back_populates="question", uselist=False, cascade="all, delete-orphan")

class InterviewAnswer(Base):
    __tablename__ = "interview_answers"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    question_id = Column(String(36), ForeignKey("interview_questions.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    candidate_answer = Column(Text, nullable=False)
    technical_accuracy_score = Column(Integer, nullable=False)
    clarity_score = Column(Integer, nullable=False)
    completeness_score = Column(Integer, nullable=False)
    project_understanding_score = Column(Integer, nullable=False)
    concise_feedback = Column(Text, nullable=False)
    strengths = Column(JSON, nullable=False, default=list)
    improvement_tips = Column(JSON, nullable=False, default=list)
    recruiter_follow_up = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    question = relationship("InterviewQuestion", back_populates="answer")
