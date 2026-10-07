import re
from typing import Dict, List, Any, Tuple

# Section heading detection patterns
SECTION_HEADER_PATTERNS: Dict[str, List[re.Pattern]] = {
    "Summary": [
        re.compile(r"^\s*(?:professional\s+)?summary\b", re.IGNORECASE),
        re.compile(r"^\s*(?:career\s+)?objective\b", re.IGNORECASE),
        re.compile(r"^\s*about\s+me\b", re.IGNORECASE),
        re.compile(r"^\s*(?:executive\s+)?profile\b", re.IGNORECASE),
    ],
    "Experience": [
        re.compile(r"^\s*(?:work\s+|professional\s+)?experience\b", re.IGNORECASE),
        re.compile(r"^\s*employment\s+history\b", re.IGNORECASE),
        re.compile(r"^\s*work\s+history\b", re.IGNORECASE),
        re.compile(r"^\s*internships?\b", re.IGNORECASE),
    ],
    "Education": [
        re.compile(r"^\s*education(?:al\s+background)?\b", re.IGNORECASE),
        re.compile(r"^\s*academic\s+background\b", re.IGNORECASE),
        re.compile(r"^\s*qualifications?\b", re.IGNORECASE),
    ],
    "Skills": [
        re.compile(r"^\s*(?:technical\s+|core\s+)?skills\b", re.IGNORECASE),
        re.compile(r"^\s*technologies\b", re.IGNORECASE),
        re.compile(r"^\s*tech\s+stack\b", re.IGNORECASE),
        re.compile(r"^\s*competencies\b", re.IGNORECASE),
        re.compile(r"^\s*tools\s*&\s*technologies\b", re.IGNORECASE),
    ],
    "Projects": [
        re.compile(r"^\s*(?:key\s+|academic\s+|personal\s+)?projects\b", re.IGNORECASE),
        re.compile(r"^\s*portfolio\s+projects\b", re.IGNORECASE),
    ],
    "Certifications": [
        re.compile(r"^\s*certifications?\b", re.IGNORECASE),
        re.compile(r"^\s*licenses?\s*(?:&|and)\s*certifications?\b", re.IGNORECASE),
        re.compile(r"^\s*credentials?\b", re.IGNORECASE),
    ],
    "Achievements": [
        re.compile(r"^\s*achievements?\b", re.IGNORECASE),
        re.compile(r"^\s*honors?\s*(?:&|and)\s*awards?\b", re.IGNORECASE),
        re.compile(r"^\s*accomplishments?\b", re.IGNORECASE),
    ],
    "Publications": [
        re.compile(r"^\s*publications?\b", re.IGNORECASE),
        re.compile(r"^\s*research\s+papers?\b", re.IGNORECASE),
    ],
}

def detect_sections(text: str) -> Dict[str, Any]:
    """
    Parses resume text line by line to detect standard sections.
    Returns:
    - detected_sections: map of {canonical_section_name: section_text}
    - missing_sections: list of standard sections not found
    - section_snippets: list of {name, verified, content, itemCount}
    """
    lines = [line.strip() for line in text.split("\n")]
    boundaries: List[Tuple[int, str]] = []

    for idx, line in enumerate(lines):
        if not line or len(line) > 50:
            continue

        clean_line = re.sub(r"[:\-_#=*]+$", "", line).strip()

        for canonical_name, patterns in SECTION_HEADER_PATTERNS.items():
            if any(p.match(clean_line) for p in patterns):
                boundaries.append((idx, canonical_name))
                break

    detected_map: Dict[str, str] = {}
    section_snippets: List[Dict[str, Any]] = []

    if not boundaries:
        # If no explicit headings found, treat full text as General/Summary
        detected_map["Summary"] = text
        section_snippets.append({
            "name": "Summary",
            "verified": False,
            "content": text[:300],
            "item_count": 1,
        })
    else:
        for i in range(len(boundaries)):
            start_idx, sec_name = boundaries[i]
            end_idx = boundaries[i + 1][0] if i + 1 < len(boundaries) else len(lines)
            content_lines = lines[start_idx + 1:end_idx]
            sec_text = "\n".join(content_lines).strip()

            detected_map[sec_name] = sec_text
            section_snippets.append({
                "name": sec_name,
                "verified": True,
                "content": sec_text[:300],
                "item_count": len([l for l in content_lines if l.strip()]),
            })

    all_expected = list(SECTION_HEADER_PATTERNS.keys())
    missing_sections = [sec for sec in all_expected if sec not in detected_map]

    return {
        "sections": detected_map,
        "missing_sections": missing_sections,
        "snippets": section_snippets,
    }
