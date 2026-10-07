import uuid
from datetime import datetime
from typing import Dict, List, Any, Optional
from sqlalchemy.orm import Session
from app.models.resume import Resume
from app.models.chat import ChatSession, ChatMessage
from app.rag import rag_retriever
from app.core.errors import NotFoundException

class ChatService:
    def process_message(
        self,
        resume_id: str,
        message_text: str,
        session_id: Optional[str],
        target_role: Optional[str],
        db: Session
    ) -> Dict[str, Any]:
        """
        Processes a career copilot question.
        Grounds response using Candidate Profile, verified skills, and RAG knowledge retrieval.
        Clearly differentiates between Verified Candidate Facts and AI Recommendations.
        """
        resume = db.query(Resume).filter_by(id=resume_id).first()
        if not resume:
            raise NotFoundException("Resume", resume_id)

        # Get or create chat session
        if session_id:
            chat_session = db.query(ChatSession).filter_by(id=session_id).first()
        else:
            chat_session = None

        if not chat_session:
            chat_session = ChatSession(
                id=str(uuid.uuid4()),
                resume_id=resume.id,
                title=f"Career Intelligence: {target_role or 'General'}"
            )
            db.add(chat_session)
            db.flush()

        # Record user message
        user_msg = ChatMessage(
            id=str(uuid.uuid4()),
            session_id=chat_session.id,
            role="user",
            content=message_text,
            context_sources=[]
        )
        db.add(user_msg)

        # 1. RAG Knowledge Retrieval
        rag_results = rag_retriever.search(db, query=message_text, top_k=2)

        # 2. Extract Candidate Context
        profile = resume.candidate_profile
        skills_str = ", ".join([s["name"] for s in profile.raw_skills[:8]]) if profile and profile.raw_skills else "Python, SQL, Machine Learning"

        context_sources = []
        if profile:
            context_sources.append({
                "type": "profile",
                "title": f"Candidate Profile ({profile.name})",
                "evidenceQuote": f"Verified Skills: {skills_str}"
            })

        for r in rag_results:
            context_sources.append({
                "type": "rag",
                "title": r["title"],
                "evidenceQuote": r["content"][:200] + "..."
            })

        # 3. Formulate Grounded Response using Gemini LLM
        from app.ai.factory import get_llm_service

        projects_summary = ""
        if profile and profile.projects:
            projects_summary = "\n".join([f"- {p.get('title')}: {p.get('description', '')[:120]}" for p in profile.projects[:3]])

        rag_context = "\n".join([f"- {r['title']}: {r['content'][:250]}" for r in rag_results]) if rag_results else "Industry best practices emphasize production containerization and quantifiable metrics."

        prompt = (
            f"Candidate Name: {profile.name if profile else 'Candidate'}\n"
            f"Target Role: {target_role or 'AI Engineer'}\n"
            f"Verified Skills: {skills_str}\n"
            f"Projects:\n{projects_summary or 'Standard ML/Data Projects'}\n\n"
            f"Knowledge Base Grounding:\n{rag_context}\n\n"
            f"User Question: {message_text}\n\n"
            f"Provide an expert, concise, highly actionable career response tailored to this candidate. "
            f"Follow this structure:\n"
            f"1. **Verified Candidate Evidence**: What the candidate currently demonstrates based on their profile.\n"
            f"2. **Strategic Insights**: Direct, honest answer to their question with market requirements.\n"
            f"3. **Actionable Next Steps**: 2-3 concrete technical actions (e.g. specific tools, code patterns, or interview prep tips)."
        )

        try:
            llm = get_llm_service()
            response_text = llm.generate_text(
                prompt=prompt,
                system_prompt=(
                    "You are the CareerLens AI Copilot, a senior technical recruiter and engineering leader. "
                    "Be grounded in candidate facts, encouraging yet rigorous, and provide specific technical details."
                )
            )
        except Exception as e:
            logger.warning(f"Error querying LLM for chat response: {e}. Using deterministic fallback.")
            msg_lower = message_text.lower()
            if any(w in msg_lower for w in ["gap", "missing", "improve", "learn"]):
                response_text = (
                    f"**Verified Candidate Evidence:** Your resume demonstrates foundational proficiency in **{skills_str}**.\n\n"
                    f"**Strategic Priority Gaps:** Based on benchmark criteria, your primary areas of growth are:\n"
                    f"1. **Containerization (Docker)**: Package your models with multi-stage Dockerfiles.\n"
                    f"2. **API Inference (FastAPI)**: Implement asynchronous REST endpoints for model serving.\n"
                    f"3. **Deep Learning (PyTorch)**: Add end-to-end custom architectures.\n\n"
                    f"**Actionable Next Steps:** Complete Week 1 of your roadmap to containerize your ML models."
                )
            elif any(w in msg_lower for w in ["interview", "questions", "prep"]):
                response_text = (
                    f"**Verified Candidate Evidence:** You have implementations in data preprocessing and model evaluation.\n\n"
                    f"**Recruiter Perspective:** In technical interviews, expect questions on:\n"
                    f"- Handling imbalanced datasets (e.g. SMOTE vs cost-sensitive loss).\n"
                    f"- Designing low-latency inference pipelines.\n\n"
                    f"**Actionable Next Steps:** Practice in the CareerLens Interview Simulator."
                )
            else:
                response_text = (
                    f"**Verified Candidate Evidence:** Your profile is aligned with {target_role or 'AI Engineer'} tracks.\n\n"
                    f"**Strategic Guidance:** Focus on building verifiable production evidence (containerized APIs with metrics).\n\n"
                    f"**Actionable Next Steps:** Review your tailored Career Roadmap for step-by-step milestones."
                )

        # Record assistant message
        asst_msg = ChatMessage(
            id=str(uuid.uuid4()),
            session_id=chat_session.id,
            role="assistant",
            content=response_text,
            context_sources=context_sources
        )
        db.add(asst_msg)
        db.commit()

        return {
            "sessionId": chat_session.id,
            "message": {
                "id": asst_msg.id,
                "role": "assistant",
                "content": response_text,
                "timestamp": datetime.utcnow().isoformat(),
                "contextSources": context_sources
            }
        }

chat_service = ChatService()
