import { RecruiterAnalysis } from "../types";
import { mockRecruiterAnalysis } from "./mockData";
import { simulateDelay, USE_MOCK, API_BASE_URL } from "./api";

export const analysisService = {
  async getRecruiterAnalysis(resumeId: string): Promise<RecruiterAnalysis> {
    if (USE_MOCK) {
      await simulateDelay(250);
      return mockRecruiterAnalysis;
    }
    const res = await fetch(`${API_BASE_URL}/resumes/${resumeId}/analysis`);
    if (!res.ok) throw new Error("Failed to load recruiter analysis");
    return res.json();
  },
};
