from pydantic import Field
from typing import Optional, List, Literal
from uuid import UUID
from datetime import datetime
from app.schemas.common import CamelModel

EvidenceStatusType = Literal["FOUND", "INFERRED", "NOT_FOUND"]

class CandidateEducationSchema(CamelModel):
    institution: str
    degree: str
    field: str
    start_year: Optional[str] = None
    end_year: Optional[str] = None
    gpa: Optional[str] = "Not found in resume"
    status: EvidenceStatusType = "FOUND"

class CandidateExperienceSchema(CamelModel):
    company: str
    title: str
    duration: Optional[str] = None
    location: Optional[str] = None
    bullets: List[str] = Field(default_factory=list)
    technologies: List[str] = Field(default_factory=list)
    status: EvidenceStatusType = "FOUND"

class CandidateProjectSchema(CamelModel):
    id: Optional[str] = None
    title: str
    description: str
    technologies: List[str] = Field(default_factory=list)
    bullets: List[str] = Field(default_factory=list)
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    metrics_present: bool = False
    deployment_present: bool = False
    status: EvidenceStatusType = "FOUND"

class CandidateCertificationSchema(CamelModel):
    name: str
    issuer: Optional[str] = None
    status: EvidenceStatusType = "NOT_FOUND"

class CandidateSkillItemSchema(CamelModel):
    name: str
    category: str
    confidence: EvidenceStatusType = "FOUND"
    evidence_snippet: Optional[str] = None
    source_section: Optional[str] = None

class CandidateProfileBase(CamelModel):
    name: str
    email: Optional[str] = "Not found in resume"
    phone: Optional[str] = "Not found in resume"
    location: Optional[str] = "Not found in resume"
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    executive_summary: str = ""
    years_of_experience: float = 0.0
    education: List[CandidateEducationSchema] = Field(default_factory=list)
    work_experience: List[CandidateExperienceSchema] = Field(default_factory=list)
    projects: List[CandidateProjectSchema] = Field(default_factory=list)
    certifications: List[CandidateCertificationSchema] = Field(default_factory=list)
    achievements: List[str] = Field(default_factory=list)
    publications: List[str] = Field(default_factory=list)
    skills: List[CandidateSkillItemSchema] = Field(default_factory=list)
    missing_sections: List[str] = Field(default_factory=list)
    is_demo: bool = False

class CandidateProfileCreate(CandidateProfileBase):
    resume_id: UUID

class CandidateProfileRead(CandidateProfileBase):
    id: UUID
    resume_id: UUID
    created_at: datetime
    updated_at: datetime
