from pydantic import Field
from typing import Optional, List
from uuid import UUID
from app.schemas.common import CamelModel

class STARBreakdownSchema(CamelModel):
    situation: str
    task: str
    action: str
    result: str = "Not found in resume - add quantified metrics if available"

class ProjectAnalysisResponse(CamelModel):
    id: str
    project_id: str
    title: str
    overall_score: int = Field(ge=0, le=100)
    problem_clarity_score: int = Field(ge=0, le=100)
    technical_complexity_score: int = Field(ge=0, le=100)
    business_relevance_score: int = Field(ge=0, le=100)
    technology_depth_score: int = Field(ge=0, le=100)
    ml_ai_depth_score: int = Field(ge=0, le=100)
    deployment_score: int = Field(ge=0, le=100)
    testing_score: int = Field(ge=0, le=100)
    documentation_score: int = Field(ge=0, le=100)
    star_alignment_score: int = Field(ge=0, le=100)
    star_breakdown: STARBreakdownSchema
    strengths: List[str] = Field(default_factory=list)
    weaknesses: List[str] = Field(default_factory=list)
    recruiter_questions: List[str] = Field(default_factory=list)
    improvement_plan: List[str] = Field(default_factory=list)
