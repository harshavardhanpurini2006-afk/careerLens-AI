export type InterviewType = "HR" | "Technical" | "Project";
export type InterviewDifficulty = "Entry/Fresher" | "Mid-Level" | "Senior";

export interface InterviewQuestion {
  id: string;
  orderIndex: number;
  questionText: string;
  category: string;
  difficulty: InterviewDifficulty;
  sourceContext: {
    type: "resume_project" | "resume_skill" | "role_gap";
    detail: string;
  };
  expectedKeyPoints: string[];
}

export interface InterviewEvaluation {
  questionId: string;
  candidateAnswer: string;
  technicalAccuracyScore: number; // 0-100
  clarityScore: number; // 0-100
  completenessScore: number; // 0-100
  projectUnderstandingScore: number; // 0-100
  conciseFeedback: string;
  strengths: string[];
  improvementTips: string[];
  recruiterFollowUp: string;
}

export interface InterviewSession {
  id: string;
  resumeId: string;
  targetRole: string;
  interviewType: InterviewType;
  difficulty: InterviewDifficulty;
  questions: InterviewQuestion[];
  evaluations: Record<string, InterviewEvaluation>;
  overallScore?: number;
  feedbackSummary?: string;
  status: "in_progress" | "completed";
}
