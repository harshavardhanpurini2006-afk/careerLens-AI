# CareerLens AI — API Specifications & Schema Contracts

Base Path: `/api/v1`

All responses and errors adhere to strict JSON contracts with standardized HTTP status codes.

---

## 1. Resume Ingestion & Processing

### `POST /api/v1/resumes/upload`
Uploads a candidate resume document (`.pdf`, `.docx`, `.txt`) up to 10MB.
* **Form-Data**: `file`: File
* **Response (201 Created)**:
```json
{
  "resume_id": "9f4a21e4-8b22-45e1-8071-c0e816a782b1",
  "status": "pending",
  "filename": "Alex_Rivera_AI_Resume_2025.pdf",
  "created_at": "2025-02-15T10:30:00Z"
}
```

### `GET /api/v1/resumes/{id}/status`
Polls the real-time processing status of an uploaded document.
* **Response (200 OK)**:
```json
{
  "status": "completed",
  "progress_percent": 100,
  "stage": "recruiter_evaluation_complete"
}
```

---

## 2. Intelligence & Diagnostics Endpoints

### `GET /api/v1/resumes/{id}/profile`
Returns the structured candidate profile with `FOUND`, `INFERRED`, or `NOT_FOUND` evidence statuses.

### `GET /api/v1/resumes/{id}/analysis`
Returns executive recruiter summary, 4 core signals (Green, Yellow, Red), and priority actions.

### `GET /api/v1/resumes/{id}/roles`
Returns match percentages and gap breakdowns across all 11 supported roles.

### `GET /api/v1/resumes/{id}/skills?role_id={role_code}`
Returns the 10-category skill matrix classified into Strong, Intermediate, Needs Improvement, and Missing.

### `GET /api/v1/resumes/{id}/ats-score`
Returns the 8-dimension ATS score and actionable before/after sentence rewrites.

---

## 3. Comparison, Improvements & Simulations

### `POST /api/v1/job-descriptions/analyze`
Compares candidate resume against pasted Job Description text.
* **Request Body**:
```json
{
  "resume_id": "9f4a21e4-8b22-45e1-8071-c0e816a782b1",
  "jd_text": "Requirements: Python, PyTorch, Docker, SQL..."
}
```

### `POST /api/v1/resumes/{id}/improvements`
Generates fact-grounded bullet point rewrites without invented facts.

### `POST /api/v1/interviews/start`
Starts a tailored mock interview session grounded in the candidate's actual projects.

### `POST /api/v1/interviews/{session_id}/answer`
Evaluates a candidate's answer against Technical Accuracy, Clarity, and STAR rubrics.

### `POST /api/v1/chat`
Conversational Career AI Copilot grounded in candidate credentials and role benchmarks.
