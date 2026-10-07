import uuid
from typing import Dict, List, Any, Set
from app.scoring.skill_normalizer import skill_normalizer

def evaluate_skill_gaps(
    role: Dict[str, Any],
    candidate_profile: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Evaluates skill gaps for a candidate against a target job role.
    Categorizes skills into Strong, Intermediate, Needs Improvement, or Missing.
    Strictly follows Zero-Fabrication: If evidence is missing, reports 'Not found in resume'.
    """
    candidate_skills = {
        s.get("name", "").lower(): s for s in candidate_profile.get("skills", [])
    }
    candidate_projects = candidate_profile.get("projects", [])
    candidate_experience = candidate_profile.get("work_experience", [])

    # Map technologies mentioned in projects and experience
    project_techs: Dict[str, str] = {}
    for p in candidate_projects:
        title = p.get("title", "Project")
        for t in p.get("technologies", []):
            project_techs[t.lower()] = f"Demonstrated in '{title}' project."

    exp_techs: Dict[str, str] = {}
    for exp in candidate_experience:
        company = exp.get("company", "Company")
        for t in exp.get("technologies", []):
            exp_techs[t.lower()] = f"Used during role at '{company}'."

    role_code = role.get("role_code", "")
    role_name = role.get("display_name", "")
    required_skills = role.get("required_skills", [])
    preferred_skills = role.get("preferred_skills", [])

    items: List[Dict[str, Any]] = []
    strong_count = 0
    intermediate_count = 0
    needs_improvement_count = 0
    missing_count = 0
    categories_set: Set[str] = set()

    all_eval_skills = []
    for s in required_skills:
        all_eval_skills.append((s, "Required", "Critical"))
    for s in preferred_skills:
        all_eval_skills.append((s, "Preferred", "High"))

    for skill_name, role_req, importance in all_eval_skills:
        canon_name, cat = skill_normalizer.normalize(skill_name)
        categories_set.add(cat)
        lower_name = canon_name.lower()

        # Check evidence sources
        is_in_exp = lower_name in exp_techs
        is_in_proj = lower_name in project_techs
        is_in_skills = lower_name in candidate_skills

        if is_in_exp:
            status = "Strong"
            evidence = exp_techs[lower_name]
            reason = "Skill is backed by verified commercial or internship experience."
            rec_action = f"Continue deepening architectural scale and optimization in {canon_name}."
            strong_count += 1
        elif is_in_proj:
            status = "Intermediate"
            evidence = project_techs[lower_name]
            reason = "Skill is demonstrated through academic/portfolio project implementations."
            rec_action = f"Add production metrics or test coverage using {canon_name}."
            intermediate_count += 1
        elif is_in_skills:
            status = "Needs Improvement"
            evidence = "Listed in Skills section but lacks project or work experience bullet points."
            reason = "Keyword present in resume, but missing concrete implementation context."
            rec_action = f"Build an end-to-end project applying {canon_name} to prove practical proficiency."
            needs_improvement_count += 1
        else:
            status = "Missing"
            evidence = "Not found in resume"
            reason = f"No credible evidence of {canon_name} was found across all resume sections."
            rec_action = f"Follow recommended roadmap module to study and demonstrate {canon_name}."
            missing_count += 1

        items.append({
            "id": f"gap-{str(uuid.uuid4())[:8]}",
            "skill": canon_name,
            "category": cat,
            "current_status": status,
            "role_requirement": role_req,
            "importance": importance,
            "evidence": evidence,
            "source_section": "Experience" if is_in_exp else ("Projects" if is_in_proj else ("Skills" if is_in_skills else None)),
            "reason": reason,
            "recommended_action": rec_action,
        })

    return {
        "role_code": role_code,
        "role_name": role_name,
        "total_skills": len(items),
        "strong_count": strong_count,
        "intermediate_count": intermediate_count,
        "needs_improvement_count": needs_improvement_count,
        "missing_count": missing_count,
        "categories": sorted(list(categories_set)),
        "items": items,
    }
