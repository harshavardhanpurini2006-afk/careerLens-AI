import time
import uuid
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.logging import logger
from app.core.errors import AppException
from app.db.session import init_db
from app.api.v1.router import api_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure tables exist and directories are ready
    logger.info("Initializing CareerLens AI Backend...")
    try:
        init_db()
        logger.info("Database schemas verified.")
    except Exception as e:
        logger.error(f"Database schema initialization warning: {e}")
    yield
    # Shutdown
    logger.info("Shutting down CareerLens AI Backend.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="CareerLens AI - Production Backend with Document Intelligence, Deterministic 5-Factor Scoring, and RAG Copilot",
    version="2.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Configuration
origins = [
    settings.FRONTEND_ORIGIN,
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Middleware: Request ID & Performance Duration Logging
@app.middleware("http")
async def request_context_middleware(request: Request, call_next):
    req_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
    request.state.request_id = req_id

    start_time = time.time()
    response = await call_next(request)
    duration_ms = round((time.time() - start_time) * 1000, 2)

    response.headers["X-Request-ID"] = req_id
    logger.info(
        f"[{req_id}] {request.method} {request.url.path} -> {response.status_code} ({duration_ms}ms)"
    )
    return response

# Standardized Error Envelope Handler
@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException):
    req_id = getattr(request.state, "request_id", str(uuid.uuid4()))
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": exc.code,
                "message": exc.message,
                "details": exc.details,
                "request_id": req_id,
            }
        },
    )

@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    req_id = getattr(request.state, "request_id", str(uuid.uuid4()))
    logger.error(f"[{req_id}] Unhandled error: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected server error occurred. Please try again.",
                "details": None,
                "request_id": req_id,
            }
        },
    )

# Mount API V1
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "service": "CareerLens AI API",
        "version": "2.0.0",
        "documentation": "/docs",
        "api_prefix": settings.API_V1_STR
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
