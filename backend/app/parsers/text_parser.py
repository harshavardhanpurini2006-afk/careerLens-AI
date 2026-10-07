from typing import Dict, Any
from app.core.errors import ParseException

def parse_txt(file_path: str) -> Dict[str, Any]:
    """
    Extracts plain text from a .txt file with utf-8 / latin-1 fallback.
    """
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            text = f.read()
    except UnicodeDecodeError:
        try:
            with open(file_path, "r", encoding="latin-1") as f:
                text = f.read()
        except Exception as e:
            raise ParseException(f"Failed to read TXT file encoding: {str(e)}")
    except Exception as e:
        raise ParseException(f"Failed to read TXT file: {str(e)}")

    clean_text = text.strip()
    if not clean_text:
        raise ParseException("The text file is empty.")

    return {
        "raw_text": clean_text,
        "page_count": 1,
        "pages": [{"page_number": 1, "text": clean_text}],
        "parseability_flags": {
            "tables_detected": False,
            "multi_columns_detected": False,
            "non_standard_fonts": False,
            "unusual_symbols": False,
        }
    }
