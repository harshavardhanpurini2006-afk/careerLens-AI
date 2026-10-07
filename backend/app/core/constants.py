"""
CareerLens AI - Core System Constants & Scoring Weights
"""

# Resume Processing Statuses
STATUS_PENDING = "pending"
STATUS_PROCESSING = "processing"
STATUS_PARSED = "parsed"
STATUS_ANALYZING = "analyzing"
STATUS_COMPLETED = "completed"
STATUS_FAILED = "failed"

RESUME_STATUSES = [
    STATUS_PENDING,
    STATUS_PROCESSING,
    STATUS_PARSED,
    STATUS_ANALYZING,
    STATUS_COMPLETED,
    STATUS_FAILED,
]

# Scoring Weights (Deterministic 5-Factor Model)
WEIGHT_REQUIRED_SKILLS = 0.50
WEIGHT_PREFERRED_SKILLS = 0.20
WEIGHT_PROJECT_RELEVANCE = 0.10
WEIGHT_EXPERIENCE_RELEVANCE = 0.10
WEIGHT_KEYWORD_ALIGNMENT = 0.10

# File Upload Limits
MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB
ALLOWED_FILE_EXTENSIONS = {".pdf", ".docx", ".txt"}
ALLOWED_MIME_TYPES = {
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
    "text/plain",
}

# Standard Resume Section Names for Detection
STANDARD_SECTIONS = [
    "Summary",
    "Experience",
    "Education",
    "Skills",
    "Projects",
    "Certifications",
    "Achievements",
    "Publications",
    "Links",
]

# Untrusted Data / Prompt Injection Patterns to Neutralize
PROMPT_INJECTION_INDICATORS = [
    "ignore previous instructions",
    "ignore all previous",
    "system prompt",
    "reveal instructions",
    "give me a score of 100",
    "give me 100",
    "override score",
    "pretend you are",
    "bypass constraints",
    "developer mode",
]
