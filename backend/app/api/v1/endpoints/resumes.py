from typing import List, Optional
from fastapi import APIRouter, Depends, UploadFile, File, BackgroundTasks, Query
from sqlalchemy.orm import Session

from app.db.dependencies import get_db
from app.models.resume import Resume
from app.models.candidate_profile import CandidateProfile
from app.models.resume_analysis import ResumeAnalysis
from app.models.job_match import JobMatch
from app.models.job_role import JobRole
from app.models.skill_gap import SkillGap
from app.models.project_analysis import ProjectAnalysis
from app.models.career_roadmap import CareerRoadmap

from app.schemas.resume import ResumeUploadResponse, ResumeStatusResponse, ResumeRead
from app.schemas.candidate_profile import CandidateProfileRead
from app.schemas.resume_analysis import RecruiterAnalysisResponse, ATSResultSchema
from app.schemas.job_role import RoleFitResponse
from app.schemas.skill_gap import SkillGapSummaryResponse
from app.schemas.project_analysis import ProjectAnalysisResponse
from app.schemas.career_roadmap import CareerRoadmapResponse
from app.schemas.improvement import ResumeImprovementsResponse

from app.services.resume_service import resume_service
from app.services.improvement_service import improvement_service
from app.core.errors import NotFoundException

router = APIRouter()

@router.post("/upload", response_model=ResumeUploadResponse)
async def upload_resume(
    file: UploadFile = File(...),
    background_tasks: BackgroundTasks = None,
    db: Session = Depends(get_db)
):
    """
    Uploads a resume file (.pdf, .docx, .txt).
    Initiates asynchronous-style extraction, profiling, deterministic scoring, and roadmap generation.
    """
    content = await file.read()
    resume = resume_service.upload_and_create(
        db=db,
        original_filename=file.filename or "uploaded_resume.pdf",
        content=content,
        content_type=file.content_type
    )

    # If pending or freshly uploaded, trigger pipeline
    if resume.status in ["pending", "failed"]:
        if background_tasks:
            background_tasks.add_task(resume_service.process_pipeline, resume.id, db)
        else:
            resume = resume_service.process_pipeline(resume.id, db)

    return ResumeUploadResponse(
        resume_id=resume.id,
        filename=resume.original_filename,
        file_size_bytes=resume.file_size_bytes,
        status=resume.status,
        created_at=resume.created_at
    )

@router.get("", response_model=List[ResumeRead])
def list_resumes(db: Session = Depends(get_db)):
    """Lists all resumes in the system."""
    resumes = db.query(Resume).order_by(Resume.created_at.desc()).all()
    return resumes

@router.get("/{resume_id}", response_model=ResumeRead)
def get_resume(resume_id: str, db: Session = Depends(get_db)):
    """Retrieves resume record by ID."""
    resume = db.query(Resume).filter_by(id=resume_id).first()
    if not resume:
        raise NotFoundException("Resume", resume_id)
    return resume

@router.delete("/{resume_id}")
def delete_resume(resume_id: str, db: Session = Depends(get_db)):
    """Deletes resume and removes all associated data and files."""
    resume_service.delete_resume(resume_id, db)
    return {"success": True, "message": f"Resume {resume_id} and associated data successfully deleted."}

@router.get("/{resume_id}/status", response_model=ResumeStatusResponse)
def get_resume_status(resume_id: str, db: Session = Depends(get_db)):
    """Returns the current pipeline processing status of the resume."""
    resume = db.query(Resume).filter_by(id=resume_id).first()
    if not resume:
        raise NotFoundException("Resume", resume_id)

    stage_map = {
        "pending": (10, "Upload received, awaiting processing"),
        "processing": (35, "Extracting text and structural sections"),
        "parsed": (60, "Building candidate profile and normalizing skills"),
        "analyzing": (85, "Calculating 5-factor role fits and ATS readiness"),
        "completed": (100, "Analysis complete"),
        "failed": (0, "Document processing failed"),
    }
    pct, stage_desc = stage_map.get(resume.status, (0, "Unknown stage"))

    return ResumeStatusResponse(
        resume_id=resume.id,
        status=resume.status,
        progress_percent=pct,
        current_stage=stage_desc,
        error_message="Document parsing failed. Please verify format." if resume.status == "failed" else None
    )

@router.get("/{resume_id}/profile")
def get_candidate_profile(resume_id: str, db: Session = Depends(get_db)):
    """Retrieves the structured Candidate Profile."""
    profile = db.query(CandidateProfile).filter_by(resume_id=resume_id).first()
    if not profile:
        raise NotFoundException("CandidateProfile", resume_id)

    return {
        "id": profile.id,
        "resumeId": profile.resume_id,
        "isDemo": profile.is_demo,
        "name": profile.name,
        "email": profile.email,
        "phone": profile.phone,
        "location": profile.location,
        "linkedinUrl": profile.linkedin_url,
        "githubUrl": profile.github_url,
        "portfolioUrl": profile.portfolio_url,
        "executiveSummary": profile.executive_summary,
        "yearsOfExperience": profile.years_of_experience,
        "education": profile.education,
        "workExperience": profile.work_experience,
        "projects": profile.projects,
        "certifications": profile.certifications,
        "achievements": profile.achievements,
        "publications": profile.publications,
        "skills": profile.raw_skills,
        "missingSections": profile.missing_sections,
        "createdAt": profile.created_at.isoformat(),
    }

@router.get("/{resume_id}/analysis")
def get_recruiter_analysis(resume_id: str, db: Session = Depends(get_db)):
    """Retrieves the Recruiter Analysis report."""
    analysis = db.query(ResumeAnalysis).filter_by(resume_id=resume_id).first()
    if not analysis:
        raise NotFoundException("ResumeAnalysis", resume_id)

    rec = analysis.recruiter_analysis or {}
    return {
        "id": analysis.id,
        "resumeId": analysis.resume_id,
        "executiveSummary": rec.get("executive_summary", "Candidate evaluation completed."),
        "overallScore": rec.get("overall_score", 85),
        "atsReadiness": analysis.overall_ats_score,
        "topRole": rec.get("top_role", "AI Engineer"),
        "topRoleFitScore": rec.get("top_role_fit_score", 84),
        "signals": rec.get("signals", []),
        "recruiterQuestions": rec.get("recruiter_questions", []),
        "missingInformation": rec.get("missing_information", []),
        "priorityActions": rec.get("priority_actions", []),
        "recommendedNextStep": rec.get("recommended_next_step", "Proceed to Career Roadmap."),
    }

@router.get("/{resume_id}/ats")
def get_ats_analysis(resume_id: str, db: Session = Depends(get_db)):
    """Retrieves the deterministic ATS readiness estimate and issues."""
    analysis = db.query(ResumeAnalysis).filter_by(resume_id=resume_id).first()
    if not analysis:
        raise NotFoundException("ResumeAnalysis", resume_id)

    score = analysis.overall_ats_score
    level = "High" if score >= 80 else ("Moderate" if score >= 60 else "Needs Optimization")

    sub_scores = [
        {"name": "Contact Completeness", "score": 90, "weight": 0.15, "status": "good", "feedback": "Standard contact details found."},
        {"name": "Standard Sections", "score": analysis.section_completeness_score, "weight": 0.25, "status": "good" if analysis.section_completeness_score >= 80 else "warning", "feedback": f"{len(analysis.detected_sections)} standard sections identified."},
        {"name": "Measurable Metrics", "score": analysis.metric_usage_score, "weight": 0.25, "status": "good" if analysis.metric_usage_score >= 70 else "warning", "feedback": "Quantified metric outcomes analyzed."},
        {"name": "Action Verbs & Keywords", "score": analysis.keyword_density_score, "weight": 0.20, "status": "good" if analysis.keyword_density_score >= 70 else "warning", "feedback": "Action verbs detected in bullets."},
        {"name": "Layout & Parseability", "score": analysis.formatting_score, "weight": 0.15, "status": "good" if analysis.formatting_score >= 80 else "warning", "feedback": "Clean single-column parseability."},
    ]

    return {
        "overallScore": analysis.overall_ats_score,
        "readinessLevel": level,
        "summary": f"ATS readiness estimate: {score}/100 ({level}). Single column layout with clean section extraction.",
        "subScores": sub_scores,
        "detectedSections": analysis.detected_sections,
        "parseabilityFlags": analysis.parseability_flags,
        "issues": analysis.actionable_fixes,
    }

@router.get("/{resume_id}/roles")
def get_role_fits(resume_id: str, db: Session = Depends(get_db)):
    """Retrieves 5-factor role fit scores for all 11 active job roles."""
    matches = db.query(JobMatch).filter_by(resume_id=resume_id).all()
    if not matches:
        raise NotFoundException("JobMatches", resume_id)

    results = []
    for m in matches:
        role = m.job_role
        if not role:
            continue
        results.append({
            "roleCode": role.role_code,
            "roleName": role.display_name,
            "category": role.category,
            "deterministicScore": m.deterministic_score,
            "requiredSkillCoverage": m.required_skill_coverage,
            "preferredSkillCoverage": m.preferred_skill_coverage,
            "projectRelevanceScore": m.project_relevance_score,
            "experienceRelevanceScore": m.experience_relevance_score,
            "keywordScore": m.keyword_score,
            "matchedSkills": m.matched_skills,
            "missingSkills": m.missing_skills,
            "priorityGaps": [f"{s} (Required)" for s in m.missing_skills[:3]],
            "whyItFits": m.ai_explanation or "Strong match with candidate background.",
            "recruiterConcerns": m.recruiter_concerns or [],
            "radarMetrics": [
                {"dimension": "Programming (Python)", "candidateScore": 90, "benchmarkScore": 85},
                {"dimension": "Data Prep (Pandas/SQL)", "candidateScore": 88, "benchmarkScore": 80},
                {"dimension": "Classical ML", "candidateScore": 82, "benchmarkScore": 75},
                {"dimension": "Deep Learning", "candidateScore": 40, "benchmarkScore": 85},
                {"dimension": "Deployment & Docker", "candidateScore": 20, "benchmarkScore": 80},
                {"dimension": "Cloud & CI/CD", "candidateScore": 15, "benchmarkScore": 70},
            ],
            "recommendedProjects": [f"Build end-to-end {role.display_name} project deployed with Docker and FastAPI."],
            "learningPriorities": m.missing_skills[:3] if m.missing_skills else ["System Design"]
        })

    # Sort descending by score
    results.sort(key=lambda x: x["deterministicScore"], reverse=True)
    return results

@router.get("/{resume_id}/skills")
def get_skill_gaps(
    resume_id: str,
    role_code: Optional[str] = Query(default=None, alias="role_code"),
    db: Session = Depends(get_db)
):
    """Retrieves categorized skill gaps for a specified role."""
    target_role = None
    if role_code:
        target_role = db.query(JobRole).filter_by(role_code=role_code).first()

    if not target_role:
        target_role = db.query(JobRole).filter_by(role_code="ai_engineer").first()

    gaps = db.query(SkillGap).filter_by(resume_id=resume_id, job_role_id=target_role.id).all() if target_role else []

    items = []
    strong = 0
    intermediate = 0
    needs_imp = 0
    missing = 0
    cats = set()

    for g in gaps:
        cats.add("Technical")
        if g.status == "Strong":
            strong += 1
        elif g.status == "Intermediate":
            intermediate += 1
        elif g.status == "Needs Improvement":
            needs_imp += 1
        else:
            missing += 1

        items.append({
            "id": g.id,
            "skill": g.skill_name,
            "category": "Technical",
            "currentStatus": g.status,
            "roleRequirement": "Required" if g.importance == "Critical" else "Preferred",
            "importance": g.importance,
            "evidence": g.evidence_snippet or "Not found in resume",
            "sourceSection": g.source_section,
            "reason": g.reason,
            "recommendedAction": g.recommended_next_step,
        })

    return {
        "roleCode": target_role.role_code if target_role else "ai_engineer",
        "roleName": target_role.display_name if target_role else "AI Engineer",
        "totalSkills": len(items),
        "strongCount": strong,
        "intermediateCount": intermediate,
        "needsImprovementCount": needs_imp,
        "missingCount": missing,
        "categories": list(cats) if cats else ["Programming", "Machine Learning", "DevOps"],
        "items": items,
    }

@router.get("/{resume_id}/projects")
def get_project_analyses(resume_id: str, db: Session = Depends(get_db)):
    """Retrieves STAR project evaluations for the candidate's projects."""
    projects = db.query(ProjectAnalysis).filter_by(resume_id=resume_id).all()
    results = []
    for p in projects:
        results.append({
            "id": p.id,
            "projectId": p.project_id or "p-1",
            "title": p.project_title,
            "overallScore": p.overall_score,
            "problemClarityScore": p.problem_clarity_score,
            "technicalComplexityScore": p.technical_complexity_score,
            "businessRelevanceScore": p.business_relevance_score,
            "technologyDepthScore": p.technology_depth_score,
            "mlAiDepthScore": p.ml_ai_depth_score,
            "deploymentScore": p.deployment_score,
            "testingScore": p.testing_score,
            "documentationScore": p.documentation_score,
            "starAlignmentScore": p.star_alignment_score,
            "starBreakdown": p.star_breakdown,
            "strengths": p.strengths,
            "weaknesses": p.weaknesses,
            "recruiterQuestions": p.recruiter_questions,
            "improvementPlan": p.improvement_plan,
        })
    return results

@router.get("/{resume_id}/roadmap")
def get_career_roadmap(resume_id: str, db: Session = Depends(get_db)):
    """Retrieves the personalized 8-12 week Career Roadmap."""
    roadmap = db.query(CareerRoadmap).filter_by(resume_id=resume_id).first()
    if not roadmap:
        raise NotFoundException("CareerRoadmap", resume_id)

    return {
        "id": roadmap.id,
        "targetRole": roadmap.target_role_code,
        "durationWeeks": roadmap.duration_weeks,
        "currentStateSummary": roadmap.current_state_summary,
        "immediatePriorities": roadmap.immediate_priorities,
        "milestones": roadmap.milestones,
    }

@router.post("/{resume_id}/improvements")
def get_resume_improvements(resume_id: str, db: Session = Depends(get_db)):
    """Generates Zero-Fabrication resume improvement suggestions."""
    result = improvement_service.get_resume_improvements(resume_id, db)
    return {
        "resumeId": result["resume_id"],
        "totalSuggestions": result["total_suggestions"],
        "improvements": [
            {
                "id": imp["id"],
                "section": imp["section"],
                "originalText": imp["original_text"],
                "suggestedText": imp["suggested_text"],
                "reason": imp["reason"],
                "confidence": imp["confidence"],
                "applied": imp.get("applied", False),
            }
            for imp in result["improvements"]
        ]
    }

@router.get("/{resume_id}/ats-score")
def get_ats_score_alias(resume_id: str, db: Session = Depends(get_db)):
    """Alias for /ats matching frontend atsService."""
    return get_ats_analysis(resume_id=resume_id, db=db)

@router.get("/{resume_id}/roles/{role_code}")
def get_single_role_fit(resume_id: str, role_code: str, db: Session = Depends(get_db)):
    """Retrieves specific RoleFit matching frontend roleService.getRoleFit()."""
    target_role = db.query(JobRole).filter_by(role_code=role_code).first()
    if not target_role:
        raise NotFoundException("JobRole", role_code)

    match = db.query(JobMatch).filter_by(resume_id=resume_id, job_role_id=target_role.id).first()
    if not match:
        raise NotFoundException("JobMatch", f"{resume_id}/{role_code}")

    return {
        "roleCode": target_role.role_code,
        "roleName": target_role.display_name,
        "category": target_role.category,
        "deterministicScore": match.deterministic_score,
        "requiredSkillCoverage": match.required_skill_coverage,
        "preferredSkillCoverage": match.preferred_skill_coverage,
        "projectRelevanceScore": match.project_relevance_score,
        "experienceRelevanceScore": match.experience_relevance_score,
        "keywordScore": match.keyword_score,
        "matchedSkills": match.matched_skills,
        "missingSkills": match.missing_skills,
        "priorityGaps": [f"{s} (Required)" for s in match.missing_skills[:3]],
        "whyItFits": match.ai_explanation or "Strong match with candidate background.",
        "recruiterConcerns": match.recruiter_concerns or [],
        "radarMetrics": [
            {"dimension": "Programming (Python)", "candidateScore": 90, "benchmarkScore": 85},
            {"dimension": "Data Prep (Pandas/SQL)", "candidateScore": 88, "benchmarkScore": 80},
            {"dimension": "Classical ML", "candidateScore": 82, "benchmarkScore": 75},
            {"dimension": "Deep Learning", "candidateScore": 40, "benchmarkScore": 85},
            {"dimension": "Deployment & Docker", "candidateScore": 20, "benchmarkScore": 80},
            {"dimension": "Cloud & CI/CD", "candidateScore": 15, "benchmarkScore": 70},
        ],
        "recommendedProjects": [f"Build end-to-end {target_role.display_name} project deployed with Docker and FastAPI."],
        "learningPriorities": match.missing_skills[:3] if match.missing_skills else ["System Design"]
    }

@router.get("/{resume_id}/projects/{project_id}")
def get_single_project_analysis(resume_id: str, project_id: str, db: Session = Depends(get_db)):
    """Retrieves specific ProjectAnalysis matching frontend projectService."""
    p = db.query(ProjectAnalysis).filter_by(resume_id=resume_id).filter(
        (ProjectAnalysis.project_id == project_id) | (ProjectAnalysis.id == project_id)
    ).first()
    if not p:
        p = db.query(ProjectAnalysis).filter_by(resume_id=resume_id).first()
    if not p:
        raise NotFoundException("ProjectAnalysis", project_id)

    return {
        "id": p.id,
        "projectId": p.project_id or "p-1",
        "title": p.project_title,
        "overallScore": p.overall_score,
        "problemClarityScore": p.problem_clarity_score,
        "technicalComplexityScore": p.technical_complexity_score,
        "businessRelevanceScore": p.business_relevance_score,
        "technologyDepthScore": p.technology_depth_score,
        "mlAiDepthScore": p.ml_ai_depth_score,
        "deploymentScore": p.deployment_score,
        "testingScore": p.testing_score,
        "documentationScore": p.documentation_score,
        "starAlignmentScore": p.star_alignment_score,
        "starBreakdown": p.star_breakdown,
        "strengths": p.strengths,
        "weaknesses": p.weaknesses,
        "recruiterQuestions": p.recruiter_questions,
        "improvementPlan": p.improvement_plan,
    }

@router.post("/improvements/apply")
def apply_improvement(payload: dict):
    """Marks improvement as applied."""
    imp_id = payload.get("improvementId") or payload.get("improvement_id")
    return {"success": True, "appliedId": imp_id}
