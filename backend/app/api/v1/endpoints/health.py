import os
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.db.dependencies import get_db
from app.core.config import settings

router = APIRouter()

@router.get("/health", summary="Basic health probe")
def health_check():
    """Returns basic liveness status."""
    return {"status": "ok", "service": "CareerLens AI Backend"}

@router.get("/ready", summary="Readiness probe")
def readiness_check(db: Session = Depends(get_db)):
    """
    Checks database connection, storage directory, and dependencies.
    """
    db_ok = False
    try:
        db.execute(text("SELECT 1"))
        db_ok = True
    except Exception as e:
        db_ok = False

    upload_dir_ok = os.path.exists(settings.UPLOAD_DIR) and os.path.isdir(settings.UPLOAD_DIR)

    if not db_ok or not upload_dir_ok:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={
                "status": "not_ready",
                "database_connected": db_ok,
                "upload_directory_ready": upload_dir_ok
            }
        )

    return {
        "status": "ready",
        "database_connected": True,
        "upload_directory_ready": True,
        "environment": settings.ENVIRONMENT
    }
