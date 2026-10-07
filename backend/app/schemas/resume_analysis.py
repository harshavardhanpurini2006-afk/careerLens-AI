from pydantic import Field
from typing import Optional, List, Dict
from uuid import UUID
from datetime import datetime
from app.schemas.common import CamelModel

class ATSSubScoreSchema(CamelModel):
    name: str
    score: float = Field(ge=0, le=100)
    weight: float
    status: str  # good, warning, critical
    feedback: str

class ATSIssueSchema(CamelModel):
    id: str
    category: str
    severity: str  # critical, warning, suggestion
    title: str
    description: str
    suggested_fix: str
    before_snippet: Optional[str] = None
    after_snippet: Optional[str] = None
    applied: bool = False

class ParseabilityFlagsSchema(CamelModel):
    tables_detected: bool = False
    multi_columns_detected: bool = False
    non_standard_fonts: bool = False
    unusual_symbols: bool = False

class DetectedSectionItemSchema(CamelModel):
    name: str
    standard: bool

class ATSResultSchema(CamelModel):
    overall_score: float = Field(ge=0, le=100)
    readiness_level: str  # High, Moderate, Needs Optimization
    summary: str
    sub_scores: List[ATSSubScoreSchema] = Field(default_factory=list)
    detected_sections: List[DetectedSectionItemSchema] = Field(default_factory=list)
    parseability_flags: ParseabilityFlagsSchema = Field(default_factory=ParseabilityFlagsSchema)
    issues: List[ATSIssueSchema] = Field(default_factory=list)

class RecruiterSignalSchema(CamelModel):
    id: str
    type: str  # green, yellow, red
    title: str
    description: str
    evidence: str

class RecruiterAnalysisResponse(CamelModel):
    id: Optional[str] = None
    resume_id: str
    executive_summary: str
    overall_score: float = Field(ge=0, le=100)
    ats_readiness: float = Field(ge=0, le=100)
    top_role: str
    top_role_fit_score: float
    signals: List[RecruiterSignalSchema] = Field(default_factory=list)
    recruiter_questions: List[str] = Field(default_factory=list)
    missing_information: List[str] = Field(default_factory=list)
    priority_actions: List[str] = Field(default_factory=list)
    recommended_next_step: str
    created_at: Optional[datetime] = None

# Alias for backwards compatibility
ResumeAnalysisResponse = RecruiterAnalysisResponse
