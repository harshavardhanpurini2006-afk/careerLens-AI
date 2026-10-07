import re
import uuid
from typing import Dict, List, Any
from app.core.constants import STANDARD_SECTIONS

ACTION_VERBS = [
    "built", "developed", "designed", "engineered", "implemented",
    "trained", "optimized", "architected", "deployed", "automated",
    "scaled", "analyzed", "reduced", "increased", "forecasted",
    "evaluated", "created", "spearheaded", "integrated", "managed",
]

def calculate_ats_readiness(
    raw_text: str,
    detected_sections: Dict[str, str],
    missing_sections: List[str],
    candidate_profile: Dict[str, Any],
    parseability_flags: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Deterministic ATS Readiness Evaluator.
    Computes rule-based sub-scores and actionable issues without LLM hallucination.
    """
    issues: List[Dict[str, Any]] = []

    # 1. Contact Info Evaluation (Weight 15%)
    contact_score = 100
    email = candidate_profile.get("email", "")
    phone = candidate_profile.get("phone", "")
    location = candidate_profile.get("location", "")
    linkedin = candidate_profile.get("linkedin_url")
    github = candidate_profile.get("github_url")

    if not email or "not found" in email.lower():
        contact_score -= 30
        issues.append({
            "id": f"iss-{str(uuid.uuid4())[:8]}",
            "category": "Contact",
            "severity": "critical",
            "title": "Missing Direct Email Address",
            "description": "ATS parsers look for an email to contact candidates automatically.",
            "suggested_fix": "Add a professional email address (e.g., your.name@example.com) to the header.",
        })
    if not phone or "not found" in phone.lower():
        contact_score -= 20
        issues.append({
            "id": f"iss-{str(uuid.uuid4())[:8]}",
            "category": "Contact",
            "severity": "warning",
            "title": "Missing Phone Number",
            "description": "Recruiters and automated screeners expect a contact telephone number.",
            "suggested_fix": "Add a standard telephone number in international format (+1 ...).",
        })
    if not (linkedin or github):
        contact_score -= 15
        issues.append({
            "id": f"iss-{str(uuid.uuid4())[:8]}",
            "category": "Contact",
            "severity": "suggestion",
            "title": "Missing Professional Links (LinkedIn / GitHub)",
            "description": "Technical recruiters verify portfolio code on GitHub and professional history on LinkedIn.",
            "suggested_fix": "Include clickable links to your LinkedIn profile and GitHub repository.",
        })
    contact_score = max(0, contact_score)

    # 2. Section Completeness (Weight 25%)
    section_score = 100
    detected_section_items = []
    for sec in STANDARD_SECTIONS:
        found = sec in detected_sections
        detected_section_items.append({"name": sec, "standard": found})
        if not found and sec in ["Experience", "Education", "Skills", "Projects"]:
            section_score -= 20
            issues.append({
                "id": f"iss-{str(uuid.uuid4())[:8]}",
                "category": "Section",
                "severity": "critical",
                "title": f"Missing Core Section: '{sec}'",
                "description": f"Standard ATS parsers search specifically for an '{sec}' header.",
                "suggested_fix": f"Create an explicit '{sec.upper()}' heading to ensure reliable parsing.",
            })
    section_score = max(0, section_score)

    # 3. Metric Usage & Measurable Impact (Weight 25%)
    # Search for numbers, percentages, speedups, scale
    metric_matches = re.findall(r"\b(?:\d+%(?:-\d+%)?|\$\d+(?:,\d+)*(?:\.\d+)?|\d+\s*(?:ms|sec|x|qps|users|students|records))\b", raw_text, re.IGNORECASE)
    metric_count = len(metric_matches)

    if metric_count >= 5:
        metric_score = 90
    elif metric_count >= 2:
        metric_score = 65
        issues.append({
            "id": f"iss-{str(uuid.uuid4())[:8]}",
            "category": "Metrics",
            "severity": "warning",
            "title": "Low Quantifiable Impact Metrics",
            "description": "Only a few numerical results were detected. Recruiters favor measurable metrics.",
            "suggested_fix": "Add verified metrics (e.g., 'processed 10k rows', 'reduced runtime by 20%') where available.",
        })
    else:
        metric_score = 40
        issues.append({
            "id": f"iss-{str(uuid.uuid4())[:8]}",
            "category": "Metrics",
            "severity": "critical",
            "title": "Absence of Quantifiable Outcomes",
            "description": "No measurable metrics or scale figures were found in project or work descriptions.",
            "suggested_fix": "Incorporate real-world scale, latency, dataset size, or accuracy figures.",
        })

    # 4. Keyword Density & Action Verbs (Weight 20%)
    lower_raw = raw_text.lower()
    action_verb_count = sum(1 for v in ACTION_VERBS if re.search(rf"\b{v}\b", lower_raw))
    verb_score = min(100, int((action_verb_count / 8) * 100))
    if verb_score < 60:
        issues.append({
            "id": f"iss-{str(uuid.uuid4())[:8]}",
            "category": "Keywords",
            "severity": "suggestion",
            "title": "Strengthen Action Verbs in Bullet Points",
            "description": "Bullet points should start with strong engineering action verbs.",
            "suggested_fix": "Begin experience and project bullets with strong verbs such as 'Engineered', 'Optimized', or 'Deployed'.",
        })

    # 5. Parseability & Formatting (Weight 15%)
    formatting_score = 95
    if parseability_flags.get("tables_detected"):
        formatting_score -= 20
        issues.append({
            "id": f"iss-{str(uuid.uuid4())[:8]}",
            "category": "Formatting",
            "severity": "warning",
            "title": "Tables Detected in Document Layout",
            "description": "Multi-cell tables can scramble the reading order in legacy ATS parsers.",
            "suggested_fix": "Convert table-based sections into linear, top-to-bottom text format.",
        })
    if parseability_flags.get("multi_columns_detected"):
        formatting_score -= 15
        issues.append({
            "id": f"iss-{str(uuid.uuid4())[:8]}",
            "category": "Formatting",
            "severity": "suggestion",
            "title": "Multi-Column Layout Detected",
            "description": "Some ATS tools merge columns horizontally, producing jumbled sentences.",
            "suggested_fix": "Prefer a single-column layout for maximum ATS compatibility.",
        })
    formatting_score = max(0, formatting_score)

    # Weighted Overall Score
    overall_score = round(
        (contact_score * 0.15) +
        (section_score * 0.25) +
        (metric_score * 0.25) +
        (verb_score * 0.20) +
        (formatting_score * 0.15)
    )

    if overall_score >= 80:
        readiness_level = "High"
    elif overall_score >= 60:
        readiness_level = "Moderate"
    else:
        readiness_level = "Needs Optimization"

    sub_scores = [
        {"name": "Contact Completeness", "score": contact_score, "weight": 0.15, "status": "good" if contact_score >= 80 else ("warning" if contact_score >= 50 else "critical"), "feedback": f"{contact_score}/100 based on standard contact attributes."},
        {"name": "Standard Sections", "score": section_score, "weight": 0.25, "status": "good" if section_score >= 80 else "warning", "feedback": f"{len(detected_sections)} standard sections identified."},
        {"name": "Measurable Metrics", "score": metric_score, "weight": 0.25, "status": "good" if metric_score >= 70 else ("warning" if metric_score >= 50 else "critical"), "feedback": f"{metric_count} quantified outcome patterns detected."},
        {"name": "Action Verbs & Keywords", "score": verb_score, "weight": 0.20, "status": "good" if verb_score >= 70 else "warning", "feedback": f"{action_verb_count} distinct technical action verbs identified."},
        {"name": "Layout & Parseability", "score": formatting_score, "weight": 0.15, "status": "good" if formatting_score >= 80 else "warning", "feedback": "Single column parseability and clean text structure."},
    ]

    summary = (
        f"ATS readiness estimate: {overall_score}/100 ({readiness_level}). "
        f"Your document features clear text extraction with {len(detected_sections)} detected sections. "
        f"Addressing the {len(issues)} flagged improvements will enhance automated screening pass-rates."
    )

    return {
        "overall_score": overall_score,
        "readiness_level": readiness_level,
        "summary": summary,
        "sub_scores": sub_scores,
        "detected_sections": detected_section_items,
        "parseability_flags": parseability_flags,
        "issues": issues,
    }
