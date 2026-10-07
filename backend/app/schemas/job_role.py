from pydantic import Field
from typing import Optional, List
from uuid import UUID
from app.schemas.common import CamelModel

class RoleSkillItemSchema(CamelModel):
    name: str
    is_required: bool
    weight: float = 1.0
    importance: str = "medium"  # critical, high, medium, bonus

class RadarDataPointSchema(CamelModel):
    dimension: str
    candidate_score: float
    benchmark_score: float

class JobRoleBase(CamelModel):
    role_code: str
    display_name: str
    description: str
    category: str
    experience_expectations: str
    common_tools: List[str] = Field(default_factory=list)
    project_expectations: List[str] = Field(default_factory=list)
    interview_topics: List[str] = Field(default_factory=list)
    required_skills: List[str] = Field(default_factory=list)
    preferred_skills: List[str] = Field(default_factory=list)

class JobRoleRead(JobRoleBase):
    id: UUID
    is_active: bool = True

class RoleFitResponse(CamelModel):
    role_code: str
    role_name: str
    category: str
    deterministic_score: float = Field(ge=0, le=100)
    required_skill_coverage: float = Field(ge=0, le=100)
    preferred_skill_coverage: float = Field(ge=0, le=100)
    project_relevance_score: float = Field(ge=0, le=100)
    experience_relevance_score: float = Field(ge=0, le=100)
    keyword_score: float = Field(ge=0, le=100)
    matched_skills: List[str] = Field(default_factory=list)
    missing_skills: List[str] = Field(default_factory=list)
    priority_gaps: List[str] = Field(default_factory=list)
    why_it_fits: str
    recruiter_concerns: List[str] = Field(default_factory=list)
    radar_metrics: List[RadarDataPointSchema] = Field(default_factory=list)
    recommended_projects: List[str] = Field(default_factory=list)
    learning_priorities: List[str] = Field(default_factory=list)
