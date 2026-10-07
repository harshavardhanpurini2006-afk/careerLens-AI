import logging
import sys
import json
from datetime import datetime

class JsonFormatter(logging.Formatter):
    """Formats log records as structured JSON."""
    def format(self, record: logging.LogRecord) -> str:
        log_obj = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }
        if hasattr(record, "request_id"):
            log_obj["request_id"] = getattr(record, "request_id")
        if hasattr(record, "endpoint"):
            log_obj["endpoint"] = getattr(record, "endpoint")
        if hasattr(record, "status_code"):
            log_obj["status_code"] = getattr(record, "status_code")
        if hasattr(record, "duration_ms"):
            log_obj["duration_ms"] = getattr(record, "duration_ms")
        if record.exc_info:
            log_obj["exception"] = self.formatException(record.exc_info)
        return json.dumps(log_obj)

def setup_logging(log_level: str = "INFO"):
    """Configures structured root logging."""
    logger = logging.getLogger("careerlens")
    logger.setLevel(getattr(logging, log_level.upper(), logging.INFO))
    logger.handlers.clear()

    handler = logging.StreamHandler(sys.stdout)
    formatter = logging.Formatter("[%(asctime)s] [%(levelname)s] [%(name)s] %(message)s")
    handler.setFormatter(formatter)
    logger.addHandler(handler)
    return logger

logger = setup_logging()
