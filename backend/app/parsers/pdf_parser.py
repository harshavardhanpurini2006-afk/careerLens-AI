import pymupdf
from typing import Dict, List, Any
from app.core.errors import ParseException

def parse_pdf(file_path: str) -> Dict[str, Any]:
    """
    Extracts structured text and layout metadata from a PDF file using PyMuPDF.
    Returns:
    - raw_text: combined plain text
    - pages: list of per-page text and block info
    - page_count: total pages
    - parseability_flags: tables, multi-column, font anomalies
    """
    try:
        doc = pymupdf.open(file_path)
    except Exception as e:
        raise ParseException(f"Failed to open PDF document: {str(e)}")

    full_text_parts: List[str] = []
    pages_data: List[Dict[str, Any]] = []
    has_tables = False
    has_multi_columns = False

    try:
        for page_num in range(len(doc)):
            page = doc[page_num]
            text = page.get_text("text")
            full_text_parts.append(text)

            # Analyze layout blocks for multi-column heuristic
            blocks = page.get_text("blocks")
            x_coords = [b[0] for b in blocks if len(b) >= 5 and b[4].strip()]
            if len(x_coords) > 4:
                # If significant variance in column starting positions, flag multi-column
                distinct_lefts = set([round(x, -1) for x in x_coords])
                if len(distinct_lefts) >= 3:
                    has_multi_columns = True

            # Check for table presence
            try:
                tables = page.find_tables()
                if tables and len(tables.tables) > 0:
                    has_tables = True
            except Exception:
                pass

            pages_data.append({
                "page_number": page_num + 1,
                "text": text,
                "block_count": len(blocks),
            })

        combined_text = "\n".join(full_text_parts).strip()
        if not combined_text:
            raise ParseException("The PDF document contains no readable text (may be image-only scan).")

        return {
            "raw_text": combined_text,
            "page_count": len(doc),
            "pages": pages_data,
            "parseability_flags": {
                "tables_detected": has_tables,
                "multi_columns_detected": has_multi_columns,
                "non_standard_fonts": False,
                "unusual_symbols": False,
            }
        }
    finally:
        doc.close()
