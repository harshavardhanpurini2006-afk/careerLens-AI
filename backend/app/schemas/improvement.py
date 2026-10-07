from pydantic import Field
from typing import Optional, List, Literal
from app.schemas.common import CamelModel

SectionType = Literal["Summary", "Experience", "Projects", "Skills", "Achievements"]

class ResumeImprovementItemSchema(CamelModel):
    id: str
    section: SectionType
    original_text: str
    suggested_text: str
    reason: str
    confidence: float = Field(ge=0.0, le=1.0)
    metrics_missing_notice: Optional[str] = "Add a measurable result if available"
    applied: bool = False

class ResumeImprovementsResponse(CamelModel):
    resume_id: str
    total_suggestions: int
    improvements: List[ResumeImprovementItemSchema] = Field(default_factory=list)
