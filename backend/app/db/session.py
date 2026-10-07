from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from app.core.config import settings
import logging

logger = logging.getLogger("careerlens.db")

# Create engine
database_url = settings.DATABASE_URL
if database_url.startswith("sqlite+aiosqlite://"):
    database_url = database_url.replace("sqlite+aiosqlite://", "sqlite://")

connect_args = {}
if database_url.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

try:
    engine = create_engine(
        database_url,
        connect_args=connect_args,
        pool_pre_ping=True,
        echo=False,
    )
except Exception as e:
    logger.warning(f"Failed to connect to primary DB ({database_url}): {e}. Falling back to SQLite.")
    engine = create_engine("sqlite:///./careerlens.db", connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    """
    FastAPI dependency that yields a database session and closes it afterwards.
    """
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """
    Initializes database tables.
    """
    from app.db.base import Base
    import app.models  # Ensure all models are imported so they register with Base.metadata
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables verified/created successfully.")
