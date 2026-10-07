import os
from typing import Dict, Any
from app.parsers.pdf_parser import parse_pdf
from app.parsers.docx_parser import parse_docx
from app.parsers.text_parser import parse_txt
from app.parsers.section_detector import detect_sections
from app.core.errors import ParseException
from app.core.security import sanitize_untrusted_text

def parse_document(file_path: str) -> Dict[str, Any]:
    """
    Unified entry point for document parsing.
    Dispatches to PDF, DOCX, or TXT parsers based on file extension,
    sanitizes text, detects sections, and returns structured document intelligence.
    """
    _, ext = os.path.splitext(file_path)
    ext = ext.lower()

    if ext == ".pdf":
        result = parse_pdf(file_path)
    elif ext in [".docx", ".doc"]:
        result = parse_docx(file_path)
    elif ext == ".txt":
        result = parse_txt(file_path)
    else:
        raise ParseException(f"Unsupported file format: {ext}")

    clean_text = sanitize_untrusted_text(result["raw_text"])
    section_data = detect_sections(clean_text)

    return {
        "raw_text": result["raw_text"],
        "clean_text": clean_text,
        "page_count": result.get("page_count", 1),
        "pages": result.get("pages", []),
        "parseability_flags": result.get("parseability_flags", {}),
        "sections": section_data["sections"],
        "missing_sections": section_data["missing_sections"],
        "section_snippets": section_data["snippets"],
    }

__all__ = ["parse_document", "detect_sections"]
