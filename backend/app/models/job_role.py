import uuid
from sqlalchemy import Column, String, Float, Boolean, Text, ForeignKey, JSON, UniqueConstraint
from sqlalchemy.orm import relationship
from app.db.base import Base

class JobRole(Base):
    __tablename__ = "job_roles"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    role_code = Column(String(100), unique=True, index=True, nullable=False)
    display_name = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    experience_expectations = Column(Text, nullable=False)
    common_tools = Column(JSON, nullable=False, default=list)
    project_expectations = Column(JSON, nullable=False, default=list)
    interview_topics = Column(JSON, nullable=False, default=list)
    required_skills = Column(JSON, nullable=False, default=list)
    preferred_skills = Column(JSON, nullable=False, default=list)
    embedding = Column(JSON, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)

    role_skills = relationship("JobRoleSkill", back_populates="job_role", cascade="all, delete-orphan")
    job_matches = relationship("JobMatch", back_populates="job_role", cascade="all, delete-orphan")
    skill_gaps = relationship("SkillGap", back_populates="job_role", cascade="all, delete-orphan")

class JobRoleSkill(Base):
    __tablename__ = "job_role_skills"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    job_role_id = Column(String(36), ForeignKey("job_roles.id", ondelete="CASCADE"), nullable=False, index=True)
    skill_id = Column(String(36), ForeignKey("skills.id", ondelete="CASCADE"), nullable=False, index=True)
    is_required = Column(Boolean, default=True, nullable=False)
    weight = Column(Float, default=1.0, nullable=False)
    importance = Column(String(50), default="medium", nullable=False)

    __table_args__ = (
        UniqueConstraint("job_role_id", "skill_id", name="uq_job_role_skill"),
    )

    job_role = relationship("JobRole", back_populates="role_skills")
    skill = relationship("Skill", back_populates="job_role_skills")
