from pydantic import Field
from typing import Optional, List, Literal
from app.schemas.common import CamelModel

SkillStatusType = Literal["Strong", "Intermediate", "Needs Improvement", "Missing"]
RoleRequirementType = Literal["Required", "Preferred", "Bonus"]
SkillImportanceType = Literal["Critical", "High", "Medium"]

class SkillGapItemSchema(CamelModel):
    id: str
    skill: str
    category: str
    current_status: SkillStatusType
    role_requirement: RoleRequirementType
    importance: SkillImportanceType
    evidence: str = "Not found in resume"
    source_section: Optional[str] = None
    source_page: Optional[int] = None
    reason: str
    recommended_action: str

class SkillGapSummaryResponse(CamelModel):
    role_code: str
    role_name: str
    total_skills: int
    strong_count: int
    intermediate_count: int
    needs_improvement_count: int
    missing_count: int
    categories: List[str] = Field(default_factory=list)
    items: List[SkillGapItemSchema] = Field(default_factory=list)
