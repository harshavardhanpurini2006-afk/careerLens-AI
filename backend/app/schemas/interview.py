from pydantic import Field
from typing import Optional, List, Dict, Literal
from uuid import UUID
from app.schemas.common import CamelModel

InterviewType = Literal["HR", "Technical", "Project"]
InterviewDifficulty = Literal["Entry/Fresher", "Mid-Level", "Senior"]
SourceContextType = Literal["resume_project", "resume_skill", "role_gap"]

class QuestionSourceContextSchema(CamelModel):
    type: SourceContextType
    detail: str

class InterviewQuestionSchema(CamelModel):
    id: str
    order_index: int
    question_text: str
    category: str
    difficulty: InterviewDifficulty
    source_context: QuestionSourceContextSchema
    expected_key_points: List[str] = Field(default_factory=list)

class InterviewEvaluationSchema(CamelModel):
    question_id: str
    candidate_answer: str
    technical_accuracy_score: int = Field(ge=0, le=100)
    clarity_score: int = Field(ge=0, le=100)
    completeness_score: int = Field(ge=0, le=100)
    project_understanding_score: int = Field(ge=0, le=100)
    concise_feedback: str
    strengths: List[str] = Field(default_factory=list)
    improvement_tips: List[str] = Field(default_factory=list)
    recruiter_follow_up: str

class InterviewStartRequest(CamelModel):
    resume_id: UUID
    target_role: Optional[str] = None
    target_role_id: Optional[str] = None
    interview_type: InterviewType = "Technical"
    difficulty: InterviewDifficulty = "Mid-Level"

    def get_role(self) -> str:
        return self.target_role or self.target_role_id or "AI Engineer"

class InterviewAnswerRequest(CamelModel):
    question_id: str
    candidate_answer: str = Field(..., min_length=5, max_length=10000)

class InterviewSessionResponse(CamelModel):
    id: str
    resume_id: str
    target_role: str
    interview_type: InterviewType
    difficulty: InterviewDifficulty
    questions: List[InterviewQuestionSchema] = Field(default_factory=list)
    evaluations: Dict[str, InterviewEvaluationSchema] = Field(default_factory=dict)
    overall_score: Optional[int] = None
    feedback_summary: Optional[str] = None
    status: Literal["in_progress", "completed"] = "in_progress"
