from typing import Dict, List, Any, Set
from app.core.constants import (
    WEIGHT_REQUIRED_SKILLS,
    WEIGHT_PREFERRED_SKILLS,
    WEIGHT_PROJECT_RELEVANCE,
    WEIGHT_EXPERIENCE_RELEVANCE,
    WEIGHT_KEYWORD_ALIGNMENT,
)
from app.scoring.skill_normalizer import skill_normalizer

def calculate_role_fit(
    role: Dict[str, Any],
    candidate_skills: List[str],
    candidate_projects: List[Dict[str, Any]],
    candidate_experience: List[Dict[str, Any]],
    resume_raw_text: str
) -> Dict[str, Any]:
    """
    Deterministic 5-factor role matching algorithm.
    Formula:
    Score = 50% Req + 20% Pref + 10% Proj + 10% Exp + 10% KW
    The LLM never replaces or alters this numerical result.
    """
    normalized_candidate_skills: Set[str] = set()
    for s in candidate_skills:
        cname, _ = skill_normalizer.normalize(s)
        normalized_candidate_skills.add(cname.lower())

    required_skills = role.get("required_skills", [])
    preferred_skills = role.get("preferred_skills", [])

    matched_required = [s for s in required_skills if s.lower() in normalized_candidate_skills]
    missing_required = [s for s in required_skills if s.lower() not in normalized_candidate_skills]

    matched_preferred = [s for s in preferred_skills if s.lower() in normalized_candidate_skills]
    missing_preferred = [s for s in preferred_skills if s.lower() not in normalized_candidate_skills]

    # 1. Required Skill Coverage (0 - 100)
    req_cov = (len(matched_required) / len(required_skills) * 100) if required_skills else 100.0

    # 2. Preferred Skill Coverage (0 - 100)
    pref_cov = (len(matched_preferred) / len(preferred_skills) * 100) if preferred_skills else 100.0

    # 3. Project Relevance Score (0 - 100)
    proj_score = 40.0
    if candidate_projects:
        proj_score = 65.0
        # Boost if technologies overlap with role's common tools
        tools_lower = set([t.lower() for t in role.get("common_tools", [])])
        for p in candidate_projects:
            p_techs = [t.lower() for t in p.get("technologies", [])]
            overlap = set(p_techs).intersection(tools_lower)
            if overlap:
                proj_score = min(100.0, proj_score + len(overlap) * 10.0)

    # 4. Experience Relevance Score (0 - 100)
    exp_score = 40.0
    if candidate_experience:
        exp_score = 70.0
        # Boost if internships or positions mention relevant technologies
        tools_lower = set([t.lower() for t in role.get("common_tools", [])])
        for exp in candidate_experience:
            e_techs = [t.lower() for t in exp.get("technologies", [])]
            if set(e_techs).intersection(tools_lower):
                exp_score = min(100.0, exp_score + 15.0)

    # 5. Keyword Alignment Score (0 - 100)
    text_lower = resume_raw_text.lower()
    kw_hits = 0
    all_role_kws = set(required_skills + preferred_skills + role.get("common_tools", []))
    for kw in all_role_kws:
        if kw.lower() in text_lower:
            kw_hits += 1
    kw_score = (kw_hits / len(all_role_kws) * 100) if all_role_kws else 70.0

    # Calculate Deterministic Score
    deterministic_score = (
        (req_cov * WEIGHT_REQUIRED_SKILLS) +
        (pref_cov * WEIGHT_PREFERRED_SKILLS) +
        (proj_score * WEIGHT_PROJECT_RELEVANCE) +
        (exp_score * WEIGHT_EXPERIENCE_RELEVANCE) +
        (kw_score * WEIGHT_KEYWORD_ALIGNMENT)
    )
    deterministic_score = round(min(100.0, max(0.0, deterministic_score)))

    # Radar Dimensions
    def score_dim(keywords: List[str], base: float) -> float:
        present = sum(1 for k in keywords if k.lower() in normalized_candidate_skills or k.lower() in text_lower)
        return min(100.0, base + present * 20.0)

    radar_metrics = [
        {"dimension": "Programming (Python)", "candidateScore": score_dim(["python"], 50), "benchmarkScore": 85},
        {"dimension": "Data Prep (Pandas/SQL)", "candidateScore": score_dim(["pandas", "sql", "numpy"], 40), "benchmarkScore": 80},
        {"dimension": "Classical ML", "candidateScore": score_dim(["scikit-learn", "xgboost", "random forest"], 40), "benchmarkScore": 75},
        {"dimension": "Deep Learning", "candidateScore": score_dim(["pytorch", "tensorflow", "keras"], 15), "benchmarkScore": 85},
        {"dimension": "Deployment & Docker", "candidateScore": score_dim(["docker", "fastapi", "flask"], 10), "benchmarkScore": 80},
        {"dimension": "Cloud & CI/CD", "candidateScore": score_dim(["aws", "gcp", "azure", "git"], 20), "benchmarkScore": 70},
    ]

    # Generate Explainability & Recommendations
    matched_all = matched_required + matched_preferred
    missing_all = missing_required + missing_preferred
    priority_gaps = [f"{s} (Required)" for s in missing_required[:3]]

    why_it_fits = (
        f"Your resume proves hands-on proficiency in {', '.join(matched_required[:3]) if matched_required else 'core technologies'}. "
        f"You meet {round(req_cov)}% of the required skill profile for {role.get('display_name', 'this role')}. "
        f"Targeting the critical missing items will substantially increase your recruiter pass rate."
    )

    recruiter_concerns = []
    if missing_required:
        recruiter_concerns.append(f"Missing core required skills: {', '.join(missing_required[:2])}.")
    if not candidate_projects:
        recruiter_concerns.append("No technical projects listed in resume.")
    if "docker" in [s.lower() for s in missing_all]:
        recruiter_concerns.append("Lack of containerization / Docker deployment evidence.")

    return {
        "role_code": role.get("role_code"),
        "role_name": role.get("display_name"),
        "category": role.get("category"),
        "deterministic_score": deterministic_score,
        "required_skill_coverage": round(req_cov),
        "preferred_skill_coverage": round(pref_cov),
        "project_relevance_score": round(proj_score),
        "experience_relevance_score": round(exp_score),
        "keyword_score": round(kw_score),
        "matched_skills": matched_all,
        "missing_skills": missing_all,
        "priority_gaps": priority_gaps,
        "why_it_fits": why_it_fits,
        "recruiter_concerns": recruiter_concerns if recruiter_concerns else ["No critical red flags identified."],
        "radar_metrics": radar_metrics,
        "recommended_projects": [
            f"End-to-End {role.get('display_name')} pipeline deployed with Docker and FastAPI.",
            f"Production model evaluation and inference benchmark with real-world metrics."
        ],
        "learning_priorities": missing_required[:3] if missing_required else ["Advanced Systems Design"]
    }
