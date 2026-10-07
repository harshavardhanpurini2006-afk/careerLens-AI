import os
import re
import uuid
import hashlib
from typing import Tuple, Optional
from app.core.constants import (
    MAX_UPLOAD_SIZE_BYTES,
    ALLOWED_FILE_EXTENSIONS,
    ALLOWED_MIME_TYPES,
    PROMPT_INJECTION_INDICATORS,
)
from app.core.errors import SecurityException, ValidationException

def calculate_sha256(content: bytes) -> str:
    """Calculates SHA256 hex digest of file contents."""
    hasher = hashlib.sha256()
    hasher.update(content)
    return hasher.hexdigest()

def validate_magic_bytes(content: bytes, ext: str) -> bool:
    """Checks file signatures (magic bytes) to prevent fake extension uploads."""
    if ext == ".pdf":
        return content.startswith(b"%PDF")
    elif ext == ".docx":
        return content.startswith(b"PK\x03\x04")  # Standard ZIP signature used by DOCX
    elif ext == ".txt":
        try:
            content[:1024].decode("utf-8")
            return True
        except UnicodeDecodeError:
            return False
    return False

def validate_file_upload(
    original_filename: str,
    content: bytes,
    content_type: Optional[str] = None
) -> Tuple[str, str, int, str]:
    """
    Validates file upload strictly:
    - Non-empty and within size limit (<= 10MB)
    - Valid extension (.pdf, .docx, .txt)
    - Valid magic signature
    - Generates a UUID filename to prevent path traversal & script execution
    Returns: (stored_filename, safe_extension, file_size_bytes, sha256_hash)
    """
    if not content or len(content) == 0:
        raise ValidationException("Uploaded file is empty.")

    file_size_bytes = len(content)
    if file_size_bytes > MAX_UPLOAD_SIZE_BYTES:
        raise ValidationException(
            f"File exceeds maximum allowed size of {MAX_UPLOAD_SIZE_BYTES // (1024 * 1024)}MB."
        )

    # Sanitize original filename and check extension
    clean_name = os.path.basename(original_filename.strip())
    _, ext = os.path.splitext(clean_name)
    ext = ext.lower()

    if ext not in ALLOWED_FILE_EXTENSIONS:
        raise ValidationException(
            f"Unsupported file extension '{ext}'. Allowed extensions: {', '.join(sorted(ALLOWED_FILE_EXTENSIONS))}"
        )

    # Validate Magic Bytes
    if not validate_magic_bytes(content, ext):
        raise SecurityException(
            f"File content does not match declared file type '{ext}'. Potential corrupted or disguised file."
        )

    # Calculate SHA-256
    sha256_hash = calculate_sha256(content)

    # Generate secure UUID filename
    stored_filename = f"{uuid.uuid4()}{ext}"

    return stored_filename, ext, file_size_bytes, sha256_hash

def sanitize_untrusted_text(text: str) -> str:
    """
    Sanitizes untrusted candidate text:
    - Removes null bytes
    - Normalizes Unicode spaces and control characters
    - Leaves document text intact while flagging suspicious prompt injection phrases
    """
    if not text:
        return ""
    # Strip null bytes and non-printable control characters except whitespace
    cleaned = re.sub(r"[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]", "", text)
    # Normalize multiple whitespace characters
    cleaned = re.sub(r"[ \t]+", " ", cleaned)
    return cleaned.strip()

def check_prompt_injection(text: str) -> bool:
    """Detects whether text contains overt prompt injection payloads."""
    lowered = text.lower()
    for indicator in PROMPT_INJECTION_INDICATORS:
        if indicator in lowered:
            return True
    return False

def is_safe_path(base_directory: str, path: str) -> bool:
    """Prevents directory traversal attacks by verifying target resides in base."""
    resolved_base = os.path.realpath(base_directory)
    resolved_path = os.path.realpath(path)
    return resolved_path.startswith(resolved_base)
