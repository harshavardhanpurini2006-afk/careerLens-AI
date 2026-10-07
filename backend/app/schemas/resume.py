from pydantic import Field
from typing import Optional, Literal
from uuid import UUID
from datetime import datetime
from app.schemas.common import CamelModel

ResumeStatusType = Literal["pending", "processing", "parsed", "analyzing", "completed", "failed"]

class ResumeBase(CamelModel):
    original_filename: str
    file_size_bytes: int
    mime_type: str

class ResumeCreate(ResumeBase):
    stored_filename: str
    file_path: str
    sha256_hash: str
    user_id: Optional[UUID] = None

class ResumeUploadResponse(CamelModel):
    resume_id: UUID
    filename: str
    file_size_bytes: int
    status: ResumeStatusType
    created_at: datetime

class ResumeStatusResponse(CamelModel):
    resume_id: UUID
    status: ResumeStatusType
    progress_percent: int = Field(default=0, ge=0, le=100)
    current_stage: str
    error_message: Optional[str] = None

class ResumeRead(ResumeBase):
    id: UUID
    user_id: Optional[UUID] = None
    stored_filename: str
    sha256_hash: str
    raw_text: Optional[str] = None
    clean_text: Optional[str] = None
    status: ResumeStatusType
    created_at: datetime
    updated_at: datetime
