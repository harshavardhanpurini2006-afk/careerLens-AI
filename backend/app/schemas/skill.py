from pydantic import Field
from typing import Optional, List
from uuid import UUID
from app.schemas.common import CamelModel

class SkillBase(CamelModel):
    canonical_name: str
    category: str
    aliases: List[str] = Field(default_factory=list)

class SkillCreate(SkillBase):
    pass

class SkillRead(SkillBase):
    id: UUID

class SkillMatchSchema(CamelModel):
    skill_name: str
    status: str  # Strong, Intermediate, Needs Improvement, Missing
    evidence_snippet: Optional[str] = None
