# CareerLens AI — AI Career Intelligence Platform

CareerLens AI is an enterprise-grade AI Career Intelligence Platform engineered to deliver senior recruiter-grade candidate evaluations, objective skill gap analysis, ATS validation, Job Description matching, tailored interview simulations, and actionable career roadmaps.

The platform operates under the strict **Zero-Fabrication Ground Truth Principle**: it never invents skills, projects, certifications, or metrics, explicitly flagging missing attributes as `"Not found in resume"` or `"Not provided"`.

---

## Architecture & Project Phases

* **Phase 1 (Frontend)**: Next.js 16 (App Router), TypeScript, Tailwind CSS, Recharts, Lucide Icons, and 12 typed services with toggleable mock/live mode (`NEXT_PUBLIC_USE_MOCK`).
* **Phase 2 (Full Backend + DB + AI + RAG + API)**: Python 3.11+ FastAPI backend, SQLAlchemy 2.0, Alembic migrations, PyMuPDF, python-docx, deterministic 5-factor scoring engine, RAG knowledge retriever, and provider-agnostic LLM interface (Groq/OpenAI/Mock).

---

## Tech Stack

### Frontend (`/frontend`)
* **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
* **Styling**: Tailwind CSS with custom recruiter dark theme tokens
* **Icons & Visualizations**: Lucide React, Recharts (Radar Benchmark Charts)
* **API Client**: Centralized API client with fallback simulation and typed schemas

### Backend (`/backend`)
* **Framework**: FastAPI + Pydantic v2 (CamelModel serialized for TypeScript compatibility)
* **Database & ORM**: MySQL 8.0 / PostgreSQL with pgvector, SQLAlchemy 2.0, Alembic
* **Document Processing**: PyMuPDF (`fitz`), `python-docx`
* **Scoring**: Deterministic 5-factor formula:
  $$\text{Score} = 50\% \text{ Required} + 20\% \text{ Preferred} + 10\% \text{ Project} + 10\% \text{ Experience} + 10\% \text{ Keyword}$$
* **AI & RAG**: Provider-agnostic LLM abstraction (Groq, OpenAI, Mock), cosine similarity vector search

---

## Getting Started

### 1. Database Setup & Seeding

```bash
# Set environment variable (or configure backend/app/core/config.py)
set DATABASE_URL=mysql+pymysql://root:Harsha@10@localhost:3306/careerlens_ai

# Run migrations and seed data
cd backend
py -3.13 -m alembic upgrade head
py -3.13 -c "from app.db.seed import seed_database; seed_database()"
```

### 2. Backend Startup

```bash
cd backend
py -3.13 -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Interactive API documentation available at: `http://localhost:8000/docs`

### 3. Frontend Development

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Running Full Stack with Docker

```bash
docker compose up --build
```

---

## Testing

Run unit tests and full end-to-end user journey tests:

```bash
# Full test discovery
py -3.13 -m unittest discover -s backend/tests -p "test_*.py"
```

---

## Core Rules

1. **Rule 1 — Zero Fabrication**: Never hallucinate candidate facts, skills, companies, or dates.
2. **Rule 2 — Resume & JD are Untrusted Data**: Prompt injection payloads are sanitized and ignored.
3. **Rule 3 — Deterministic Scoring First**: LLMs never calculate or alter numerical fit scores.
4. **Rule 4 — Explainability**: Every recommendation includes reason, source section, and evidence.
5. **Rule 5 — No Discriminatory Scoring**: Sensitive protected attributes are never scoring criteria.
