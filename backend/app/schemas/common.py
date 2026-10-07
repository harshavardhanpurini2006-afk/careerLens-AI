from pydantic import BaseModel, Field, ConfigDict
from pydantic.alias_generators import to_camel
from typing import Optional, Any, Generic, TypeVar
from datetime import datetime

T = TypeVar("T")

class CamelModel(BaseModel):
    """
    Base model that converts snake_case Python attributes to camelCase for JSON output,
    matching the TypeScript frontend interfaces while allowing snake_case in Python.
    Also accepts both snake_case and camelCase on deserialization.
    """
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True
    )

class ErrorDetail(CamelModel):
    code: str
    message: str
    details: Optional[Any] = None
    request_id: Optional[str] = None

class ErrorResponse(CamelModel):
    error: ErrorDetail

class SuccessResponse(CamelModel, Generic[T]):
    success: bool = True
    data: T
    message: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
