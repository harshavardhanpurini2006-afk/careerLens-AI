from pydantic import Field
from typing import Optional, List, Literal
from app.schemas.common import CamelModel

MilestoneStatusType = Literal["completed", "in_progress", "upcoming"]

class RecommendedProjectSchema(CamelModel):
    name: str
    description: str
    architecture: str

class RoadmapMilestoneSchema(CamelModel):
    id: str
    phase_number: int
    phase_title: str
    title: str
    duration: str
    skills: List[str] = Field(default_factory=list)
    reason: str
    action_items: List[str] = Field(default_factory=list)
    recommended_project: Optional[RecommendedProjectSchema] = None
    status: MilestoneStatusType = "upcoming"

class CareerRoadmapResponse(CamelModel):
    id: str
    target_role: str
    duration_weeks: int = 10
    current_state_summary: str
    immediate_priorities: List[str] = Field(default_factory=list)
    milestones: List[RoadmapMilestoneSchema] = Field(default_factory=list)
