# CareerLens AI — System Architecture & Design Specification

## 1. High-Level System Architecture

CareerLens AI utilizes a modular monorepo layout separating client presentation (`/frontend`) from domain intelligence and database storage (`/backend`).

```
                    ┌────────────────────────────────────────────────────────┐
                    │               Frontend (Next.js 16 / React 19)          │
                    │   - 14 Interactive App Router Routes                   │
                    │   - AppShell & Slide-out Career Copilot Drawer         │
                    │   - Radar Charts & ScoreGauges                         │
                    └───────────────────────────┬────────────────────────────┘
                                                │
                                    REST API Layer (/api/v1)
                                    Mock / Live Adapter Toggle
                                                │
                    ┌───────────────────────────▼────────────────────────────┐
                    │               Backend (FastAPI / Python 3.11+)         │
                    │   - Secure Upload Sanitizer & SHA256 Deduplication     │
                    │   - PyMuPDF / python-docx Document Parsers             │
                    │   - Prompt Injection Defense Guardrails                │
                    │   - 5-Factor Deterministic Role Scorer                 │
                    │   - Provider-Agnostic LLM Layer (Groq / OpenAI)        │
                    └───────────────────────────┬────────────────────────────┘
                                                │
                                   SQLAlchemy 2.0 Async / RAG
                                                │
                    ┌───────────────────────────▼────────────────────────────┐
                    │           Storage & Knowledge Tier (PostgreSQL 16)      │
                    │   - 20 Relational Schema Tables                        │
                    │   - pgvector Vector Embeddings (1536 dim)              │
                    │   - Seed Corpus: 11 Tech Roles, 300+ Skills            │
                    └────────────────────────────────────────────────────────┘
```

---

## 2. Core Architectural Principles

### 2.1 Zero-Fabrication UX Protocol
* The platform never invents candidate facts (skills, titles, years, metrics, certifications).
* Where data is absent, the system displays `"Not found in resume"` or `"Not provided"`.
* The AI rewriter strengthens phrasing and STAR structure using solely verified evidence.

### 2.2 Deterministic Scoring Over LLM Guesswork
* Role match percentages are computed using a configurable weighted formula:
  $$\text{Score} = 0.50 \cdot S_{\text{req}} + 0.20 \cdot S_{\text{pref}} + 0.10 \cdot S_{\text{proj}} + 0.10 \cdot S_{\text{exp}} + 0.10 \cdot S_{\text{kw}}$$
* LLMs provide qualitative recruiter explanations, interview simulations, and contextual advice.

### 2.3 Document Untrusted Boundary
* Resumes and Job Descriptions are treated as untrusted strings delimited inside `<untrusted_document_data>`. Prompt overrides are treated strictly as document content and ignored.

---

## 3. Supported 11 Target Roles
1. AI Engineer
2. Machine Learning Engineer
3. Generative AI Engineer
4. Data Scientist
5. Data Analyst
6. Data Engineer
7. Python Developer
8. Backend Developer
9. NLP Engineer
10. Computer Vision Engineer
11. MLOps Engineer
