# CareerLens AI — Environment Configuration Guide

This file defines all configuration settings for local development and production environments.

---

## 1. Frontend Configuration (`frontend/.env.local`)

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_USE_MOCK` | Toggle mock service adapter (`true`) vs live backend (`false`) | `true` |
| `NEXT_PUBLIC_API_URL` | Base URL for FastAPI REST endpoints | `http://localhost:8000/api/v1` |

---

## 2. Backend Configuration (`backend/.env`)

| Variable | Description | Example / Recommended |
| :--- | :--- | :--- |
| `DATABASE_URL` | Async PostgreSQL connection string | `postgresql+asyncpg://postgres:postgres@localhost:5432/careerlens` |
| `LLM_PROVIDER` | Active AI provider (`groq`, `openai`, `ollama`) | `groq` |
| `LLM_MODEL` | Active LLM model name | `llama-3.3-70b-versatile` |
| `LLM_API_KEY` | Provider API authentication secret | `gsk_...` |
| `EMBEDDING_PROVIDER` | Vector embeddings engine | `openai` |
| `EMBEDDING_MODEL` | Embedding model identifier | `text-embedding-3-small` |
| `EMBEDDING_API_KEY` | Embedding API authentication secret | `sk-...` |
| `UPLOAD_DIR` | Local disk folder for sanitized uploads | `./uploads` |
| `MAX_UPLOAD_SIZE_MB` | Maximum allowed resume file size | `10` |
| `FRONTEND_ORIGIN` | CORS allowed origin for client requests | `http://localhost:3000` |
| `ENVIRONMENT` | Runtime mode (`development`, `production`) | `development` |
| `LOG_LEVEL` | Logging verbosity | `INFO` |
