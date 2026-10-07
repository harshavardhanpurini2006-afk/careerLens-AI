from typing import Optional
from uuid import UUID
from datetime import datetime
from pydantic import Field
from app.schemas.common import CamelModel

class UserBase(CamelModel):
    email: str = Field(..., description="User email address")
    full_name: str

class UserCreate(UserBase):
    password: Optional[str] = None

class UserRead(UserBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
