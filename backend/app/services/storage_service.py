import os
import shutil
from typing import Optional
from app.core.config import settings
from app.core.security import is_safe_path
from app.core.errors import SecurityException, NotFoundException

class StorageService:
    def __init__(self):
        self.upload_dir = os.path.abspath(settings.UPLOAD_DIR)
        os.makedirs(self.upload_dir, exist_ok=True)

    def save_file(self, stored_filename: str, content: bytes) -> str:
        """Saves file securely inside the configured upload directory."""
        dest_path = os.path.join(self.upload_dir, stored_filename)
        if not is_safe_path(self.upload_dir, dest_path):
            raise SecurityException("Path traversal attempt detected in filename.")

        with open(dest_path, "wb") as f:
            f.write(content)
        return dest_path

    def get_file_path(self, stored_filename: str) -> str:
        dest_path = os.path.join(self.upload_dir, stored_filename)
        if not is_safe_path(self.upload_dir, dest_path) or not os.path.isfile(dest_path):
            raise NotFoundException("File", stored_filename)
        return dest_path

    def delete_file(self, stored_filename: str) -> bool:
        dest_path = os.path.join(self.upload_dir, stored_filename)
        if is_safe_path(self.upload_dir, dest_path) and os.path.isfile(dest_path):
            try:
                os.remove(dest_path)
                return True
            except Exception:
                return False
        return False

storage_service = StorageService()
