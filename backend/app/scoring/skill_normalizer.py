import re
from typing import Dict, List, Tuple, Optional, Set
from app.db.session import SessionLocal
from app.models.skill import Skill

# Built-in synonym mappings for fast local lookups without extra DB roundtrips
CANONICAL_SYNONYMS: Dict[str, str] = {
    "python": "Python",
    "python3": "Python",
    "python 3": "Python",
    "py": "Python",
    "sql": "SQL",
    "postgres": "PostgreSQL",
    "postgresql": "PostgreSQL",
    "psql": "PostgreSQL",
    "mysql": "MySQL",
    "sqlite": "SQLite",
    "sqlite3": "SQLite",
    "scikit-learn": "Scikit-Learn",
    "scikit learn": "Scikit-Learn",
    "sklearn": "Scikit-Learn",
    "pytorch": "PyTorch",
    "torch": "PyTorch",
    "tensorflow": "TensorFlow",
    "tf": "TensorFlow",
    "keras": "Keras",
    "numpy": "NumPy",
    "pandas": "Pandas",
    "scipy": "SciPy",
    "matplotlib": "Matplotlib",
    "seaborn": "Seaborn",
    "plotly": "Plotly",
    "opencv": "OpenCV",
    "cv2": "OpenCV",
    "fastapi": "FastAPI",
    "flask": "Flask",
    "django": "Django",
    "docker": "Docker",
    "k8s": "Kubernetes",
    "kubernetes": "Kubernetes",
    "git": "Git",
    "github": "Git",
    "aws": "AWS",
    "gcp": "GCP",
    "azure": "Azure",
    "langchain": "LangChain",
    "llamaindex": "LlamaIndex",
    "mlflow": "MLflow",
    "xgboost": "XGBoost",
    "lightgbm": "LightGBM",
    "catboost": "CatBoost",
    "spark": "Apache Spark",
    "pyspark": "Apache Spark",
    "airflow": "Airflow",
    "tableau": "Tableau",
    "powerbi": "Power BI",
    "power bi": "Power BI",
    "excel": "Excel",
    "jupyter": "Jupyter",
}

class SkillNormalizer:
    def __init__(self):
        self._cache_loaded = False
        self._lookup: Dict[str, Tuple[str, str]] = {}  # {lower_token: (canonical_name, category)}

    def _ensure_cache(self):
        if self._cache_loaded:
            return
        db = SessionLocal()
        try:
            skills = db.query(Skill).all()
            for s in skills:
                canon = s.canonical_name
                cat = s.category
                self._lookup[canon.lower()] = (canon, cat)
                if s.aliases:
                    for alias in s.aliases:
                        self._lookup[alias.lower()] = (canon, cat)
            self._cache_loaded = True
        except Exception:
            # Fallback to in-memory dictionary
            for syn_lower, canon in CANONICAL_SYNONYMS.items():
                self._lookup[syn_lower] = (canon, "Technical")
            self._cache_loaded = True
        finally:
            db.close()

    def normalize(self, raw_skill_name: str) -> Tuple[str, str]:
        """
        Normalizes a raw skill string to its canonical name and category.
        If unrecognized, returns (cleaned_title_case_name, "Tool/Other").
        """
        self._ensure_cache()
        cleaned = raw_skill_name.strip()
        lower_key = cleaned.lower()

        if lower_key in self._lookup:
            return self._lookup[lower_key]

        # Strip special punctuation and re-check
        normalized_str = re.sub(r"[\(\)\[\]\,]", "", lower_key).strip()
        if normalized_str in self._lookup:
            return self._lookup[normalized_str]

        # Check built-in synonyms
        if normalized_str in CANONICAL_SYNONYMS:
            canon = CANONICAL_SYNONYMS[normalized_str]
            return canon, "Technical"

        return cleaned.title(), "Tool/Other"

    def normalize_list(self, raw_skills: List[str]) -> List[Dict[str, str]]:
        """
        Deduplicates and canonicalizes a list of skill mentions.
        Never counts aliases as duplicate skills.
        """
        seen_canonical: Set[str] = set()
        results: List[Dict[str, str]] = []

        for raw in raw_skills:
            canon_name, category = self.normalize(raw)
            if canon_name not in seen_canonical:
                seen_canonical.add(canon_name)
                results.append({
                    "name": canon_name,
                    "category": category
                })

        return results

skill_normalizer = SkillNormalizer()
