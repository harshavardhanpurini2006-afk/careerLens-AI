from typing import Optional, Any
from fastapi import HTTPException, status

class AppException(HTTPException):
    def __init__(
        self,
        status_code: int,
        code: str,
        message: str,
        details: Optional[Any] = None,
        request_id: Optional[str] = None
    ):
        super().__init__(status_code=status_code, detail=message)
        self.code = code
        self.message = message
        self.details = details
        self.request_id = request_id

class NotFoundException(AppException):
    def __init__(self, resource: str, identifier: str, request_id: Optional[str] = None):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            code=f"{resource.upper()}_NOT_FOUND",
            message=f"{resource.capitalize()} '{identifier}' was not found.",
            request_id=request_id
        )

class ValidationException(AppException):
    def __init__(self, message: str, details: Optional[Any] = None, request_id: Optional[str] = None):
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            code="VALIDATION_FAILED",
            message=message,
            details=details,
            request_id=request_id
        )

class SecurityException(AppException):
    def __init__(self, message: str, code: str = "SECURITY_VIOLATION", request_id: Optional[str] = None):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            code=code,
            message=message,
            request_id=request_id
        )

class ParseException(AppException):
    def __init__(self, message: str, details: Optional[Any] = None, request_id: Optional[str] = None):
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            code="RESUME_PARSE_FAILED",
            message=message,
            details=details,
            request_id=request_id
        )
