import os
from typing import List
try:
    from dotenv import load_dotenv
    _env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env")
    if os.path.exists(_env_path):
        load_dotenv(_env_path)
    else:
        load_dotenv()
except ImportError:
    pass

try:
    from pydantic_settings import BaseSettings
except ImportError:
    from pydantic import BaseModel
    class BaseSettings(BaseModel): # type: ignore
        def __init__(self, **kwargs):
            super().__init__(**kwargs)

class Settings(BaseSettings):
    PROJECT_NAME: str = "CareerLens AI"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")

    # Database: Supports MySQL (via .env), PostgreSQL, or SQLite fallback
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "sqlite+aiosqlite:///./careerlens.db"
    )
    SQLITE_FALLBACK_URL: str = "sqlite+aiosqlite:///./careerlens.db"

    # AI / LLM Configuration
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "gemini")
    LLM_MODEL: str = os.getenv("LLM_MODEL", "gemini-3.5-flash-lite")
    LLM_API_KEY: str = os.getenv("LLM_API_KEY", "")

    # Embeddings Configuration
    EMBEDDING_PROVIDER: str = os.getenv("EMBEDDING_PROVIDER", "openai")
    EMBEDDING_MODEL: str = os.getenv("EMBEDDING_MODEL", "text-embedding-3-small")
    EMBEDDING_API_KEY: str = os.getenv("EMBEDDING_API_KEY", "")
    EMBEDDING_DIM: int = 1536

    # Security & Uploads
    UPLOAD_DIR: str = os.getenv(
        "UPLOAD_DIR",
        os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads")
    )
    MAX_UPLOAD_SIZE_MB: int = 10
    ALLOWED_EXTENSIONS: List[str] = [".pdf", ".docx", ".txt"]
    ALLOWED_MIME_TYPES: List[str] = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
    ]

    # CORS
    FRONTEND_ORIGIN: str = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")

settings = Settings()
