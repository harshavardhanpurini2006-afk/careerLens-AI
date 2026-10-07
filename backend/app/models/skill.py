import uuid
from sqlalchemy import Column, String, JSON
from sqlalchemy.orm import relationship
from app.db.base import Base

class Skill(Base):
    __tablename__ = "skills"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    canonical_name = Column(String(255), unique=True, index=True, nullable=False)
    category = Column(String(100), index=True, nullable=False)
    aliases = Column(JSON, nullable=False, default=list)
    embedding = Column(JSON, nullable=True)

    job_role_skills = relationship("JobRoleSkill", back_populates="skill", cascade="all, delete-orphan")
