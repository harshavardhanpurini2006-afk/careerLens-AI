from fastapi import APIRouter
from app.api.v1.endpoints import health, resumes, jobs, interviews, chat, roles

api_router = APIRouter()

# Health & Readiness
api_router.include_router(health.router, tags=["System Health"])

# Roles Directory
api_router.include_router(roles.router, prefix="/roles", tags=["Job Roles Directory"])

# Resume Intelligence
api_router.include_router(resumes.router, prefix="/resumes", tags=["Resume Intelligence"])

# Job Description Matcher
api_router.include_router(jobs.router, prefix="/job-descriptions", tags=["Job Description Matching"])

# Interview Simulator
api_router.include_router(interviews.router, prefix="/interviews", tags=["Interview Simulation"])

# Career AI Copilot Chat
api_router.include_router(chat.router, prefix="/chat", tags=["Career AI Copilot"])
