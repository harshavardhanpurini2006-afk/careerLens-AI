import math
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.knowledge import KnowledgeDocument, DocumentChunk
from app.rag.embeddings import get_embedding_service

def cosine_similarity(v1: List[float], v2: List[float]) -> float:
    if not v1 or not v2 or len(v1) != len(v2):
        return 0.0
    dot = sum(a * b for a, b in zip(v1, v2))
    norm1 = math.sqrt(sum(a * a for a in v1))
    norm2 = math.sqrt(sum(b * b for b in v2))
    if norm1 == 0 or norm2 == 0:
        return 0.0
    return dot / (norm1 * norm2)

class RAGRetriever:
    def __init__(self):
        self.embedding_service = get_embedding_service()

    def search(
        self,
        db: Session,
        query: str,
        category: Optional[str] = None,
        top_k: int = 3
    ) -> List[Dict[str, Any]]:
        """
        Retrieves top-k relevant knowledge document chunks using cosine similarity search.
        Filters by category when provided.
        """
        query_vec = self.embedding_service.get_embedding(query)

        q = db.query(DocumentChunk).join(KnowledgeDocument)
        if category:
            q = q.filter(KnowledgeDocument.category == category)

        chunks = q.all()
        scored_chunks = []

        for ch in chunks:
            chunk_vec = ch.embedding
            if not chunk_vec:
                # Dynamically generate and cache embedding
                chunk_vec = self.embedding_service.get_embedding(ch.content)
                ch.embedding = chunk_vec

            sim = cosine_similarity(query_vec, chunk_vec)
            scored_chunks.append((sim, ch))

        # Sort descending by similarity
        scored_chunks.sort(key=lambda x: x[0], reverse=True)

        results = []
        for sim, ch in scored_chunks[:top_k]:
            results.append({
                "chunk_id": ch.id,
                "title": ch.document.title,
                "category": ch.document.category,
                "source_ref": ch.document.source_ref,
                "content": ch.content,
                "similarity": round(float(sim), 4),
            })

        return results

rag_retriever = RAGRetriever()
