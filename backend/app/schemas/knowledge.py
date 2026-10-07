from pydantic import Field
from typing import Optional, List, Dict, Any
from uuid import UUID
from datetime import datetime
from app.schemas.common import CamelModel

class KnowledgeDocumentBase(CamelModel):
    category: str  # job_role, skill, interview_question, technology_guide, project_idea, career_guidance
    title: str
    source_ref: Optional[str] = None
    metadata_payload: Dict[str, Any] = Field(default_factory=dict)

class KnowledgeDocumentCreate(KnowledgeDocumentBase):
    pass

class KnowledgeDocumentRead(KnowledgeDocumentBase):
    id: UUID
    created_at: datetime

class DocumentChunkBase(CamelModel):
    chunk_index: int
    content: str
    metadata_payload: Dict[str, Any] = Field(default_factory=dict)

class DocumentChunkCreate(DocumentChunkBase):
    document_id: UUID
    embedding: Optional[List[float]] = None

class DocumentChunkRead(DocumentChunkBase):
    id: UUID
    document_id: UUID
    created_at: datetime

class RAGQueryRequest(CamelModel):
    query: str
    category: Optional[str] = None
    top_k: int = 4

class RAGChunkResult(CamelModel):
    title: str
    content: str
    category: str
    source_ref: Optional[str] = None
    similarity_score: float
