from pydantic import Field
from typing import Optional, List, Literal
from uuid import UUID
from app.schemas.common import CamelModel

SeniorityLevel = Literal["Intern", "Entry-Level", "Mid-Level", "Senior"]
MatchStrength = Literal["High", "Moderate"]

class MatchedRequirementSchema(CamelModel):
    requirement: str
    evidence_quote: str
    strength: MatchStrength

class BulletTweakSchema(CamelModel):
    original_bullet: str
    tailored_bullet: str
    target_keyword: str

class JDAnalyzeRequest(CamelModel):
    resume_id: UUID
    job_description_text: Optional[str] = None
    jd_text: Optional[str] = None

    def get_text(self) -> str:
        return (self.job_description_text or self.jd_text or "").strip()

class JDComparisonResponse(CamelModel):
    id: str
    target_role: str
    company_name: Optional[str] = None
    seniority: SeniorityLevel = "Mid-Level"
    overall_match: int = Field(ge=0, le=100)
    matched_requirements: List[MatchedRequirementSchema] = Field(default_factory=list)
    missing_critical_requirements: List[str] = Field(default_factory=list)
    preferred_requirements: List[str] = Field(default_factory=list)
    keyword_gaps: List[str] = Field(default_factory=list)
    priority_actions: List[str] = Field(default_factory=list)
    suggested_bullet_tweaks: List[BulletTweakSchema] = Field(default_factory=list)
