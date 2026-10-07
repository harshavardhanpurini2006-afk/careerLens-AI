import { InterviewSession, InterviewType, InterviewDifficulty, InterviewEvaluation } from "../types";
import { mockInterviewSession } from "./mockData";
import { simulateDelay, USE_MOCK, API_BASE_URL } from "./api";

export const interviewService = {
  async startInterview(
    resumeId: string,
    targetRole: string,
    type: InterviewType,
    difficulty: InterviewDifficulty
  ): Promise<InterviewSession> {
    if (USE_MOCK) {
      await simulateDelay(400);
      return {
        ...mockInterviewSession,
        id: `session-${Date.now()}`,
        resumeId,
        targetRole,
        interviewType: type,
        difficulty,
      };
    }
    const res = await fetch(`${API_BASE_URL}/interviews/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resume_id: resumeId, target_role_id: targetRole, interview_type: type, difficulty }),
    });
    if (!res.ok) throw new Error("Failed to start interview session");
    return res.json();
  },

  async submitAnswer(
    sessionId: string,
    questionId: string,
    candidateAnswer: string
  ): Promise<InterviewEvaluation> {
    if (USE_MOCK) {
      await simulateDelay(700); // realistic evaluation simulation
      const wordCount = candidateAnswer.trim().split(/\s+/).length;
      const isStrong = wordCount > 25;

      return {
        questionId,
        candidateAnswer,
        technicalAccuracyScore: isStrong ? 88 : 65,
        clarityScore: isStrong ? 85 : 70,
        completenessScore: isStrong ? 82 : 60,
        projectUnderstandingScore: isStrong ? 90 : 68,
        conciseFeedback: isStrong
          ? "Clear, technical response directly addressing the prompt with solid conceptual foundation."
          : "Answer is brief. Consider elaborating on how this directly impacted your model's real-world outcome.",
        strengths: [
          "Demonstrates direct familiarity with the requested concept.",
          "Clear communication structure without filler phrasing.",
        ],
        improvementTips: [
          "Add one specific quantitative outcome or metric from your project.",
          "Mention trade-offs versus alternative algorithms or approaches.",
        ],
        recruiterFollowUp: "What specific metric would you monitor in production to detect model degradation over time?",
      };
    }
    const res = await fetch(`${API_BASE_URL}/interviews/${sessionId}/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question_id: questionId, candidate_answer: candidateAnswer }),
    });
    if (!res.ok) throw new Error("Failed to evaluate answer");
    return res.json();
  },
};
