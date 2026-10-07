import hashlib
import math
from typing import List, Optional
from app.core.config import settings

class BaseEmbeddingService:
    def get_embedding(self, text: str) -> List[float]:
        raise NotImplementedError

class LocalHashEmbeddingService(BaseEmbeddingService):
    """
    Lightweight deterministic embedding fallback for development and testing.
    Produces normalized 1536-dimensional vectors using token hashing and term weighting.
    """
    def __init__(self, dim: int = 1536):
        self.dim = dim

    def get_embedding(self, text: str) -> List[float]:
        vec = [0.0] * self.dim
        tokens = text.lower().split()
        if not tokens:
            return vec

        for token in tokens:
            # Deterministic bucket index
            h = int(hashlib.md5(token.encode("utf-8")).hexdigest(), 16)
            idx = h % self.dim
            vec[idx] += 1.0

        # L2 Normalize
        norm = math.sqrt(sum(x * x for x in vec))
        if norm > 0:
            vec = [x / norm for x in vec]
        return vec

class OpenAIEmbeddingService(BaseEmbeddingService):
    """OpenAI embeddings client."""
    def __init__(self, api_key: str, model: str = "text-embedding-3-small"):
        self.api_key = api_key
        self.model = model
        try:
            from openai import OpenAI
            self.client = OpenAI(api_key=api_key)
        except Exception:
            self.client = None

    def get_embedding(self, text: str) -> List[float]:
        if not self.client or not self.api_key:
            return LocalHashEmbeddingService().get_embedding(text)

        try:
            resp = self.client.embeddings.create(input=text, model=self.model)
            return resp.data[0].embedding
        except Exception:
            return LocalHashEmbeddingService().get_embedding(text)

def get_embedding_service() -> BaseEmbeddingService:
    if settings.EMBEDDING_API_KEY and settings.EMBEDDING_PROVIDER == "openai":
        return OpenAIEmbeddingService(
            api_key=settings.EMBEDDING_API_KEY,
            model=settings.EMBEDDING_MODEL or "text-embedding-3-small"
        )
    return LocalHashEmbeddingService()
