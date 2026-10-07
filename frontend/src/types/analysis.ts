export interface RecruiterSignal {
  id: string;
  type: "green" | "yellow" | "red";
  title: string;
  description: string;
  evidence: string;
}

export interface RecruiterAnalysis {
  id: string;
  resumeId: string;
  executiveSummary: string;
  overallScore: number; // 0-100
  atsReadiness: number; // 0-100
  topRole: string;
  topRoleFitScore: number;
  signals: RecruiterSignal[];
  recruiterQuestions: string[];
  missingInformation: string[];
  priorityActions: string[];
  recommendedNextStep: string;
}
