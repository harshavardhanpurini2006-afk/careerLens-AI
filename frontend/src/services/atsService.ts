import { ATSResult } from "../types";
import { mockATSResult } from "./mockData";
import { simulateDelay, USE_MOCK, API_BASE_URL } from "./api";

export const atsService = {
  async getATSResult(resumeId: string): Promise<ATSResult> {
    if (USE_MOCK) {
      await simulateDelay(250);
      return mockATSResult;
    }
    const res = await fetch(`${API_BASE_URL}/resumes/${resumeId}/ats-score`);
    if (!res.ok) throw new Error("Failed to load ATS analysis");
    return res.json();
  },

  async applyFix(issueId: string): Promise<{ success: boolean; updatedScore: number }> {
    if (USE_MOCK) {
      await simulateDelay(150);
      return { success: true, updatedScore: 82 };
    }
    const res = await fetch(`${API_BASE_URL}/ats/apply-fix`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ issueId }),
    });
    if (!res.ok) throw new Error("Failed to apply ATS fix");
    return res.json();
  },
};
