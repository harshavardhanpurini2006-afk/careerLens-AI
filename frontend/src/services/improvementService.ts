import { ResumeImprovement } from "../types";
import { mockResumeImprovements } from "./mockData";
import { simulateDelay, USE_MOCK, API_BASE_URL } from "./api";

export const improvementService = {
  async getImprovements(resumeId: string): Promise<ResumeImprovement[]> {
    if (USE_MOCK) {
      await simulateDelay(250);
      return mockResumeImprovements;
    }
    const res = await fetch(`${API_BASE_URL}/resumes/${resumeId}/improvements`);
    if (!res.ok) throw new Error("Failed to load improvements");
    const data = await res.json();
    return Array.isArray(data) ? data : data.improvements || [];
  },

  async applyImprovement(improvementId: string): Promise<{ success: boolean; appliedId: string }> {
    if (USE_MOCK) {
      await simulateDelay(150);
      return { success: true, appliedId: improvementId };
    }
    const res = await fetch(`${API_BASE_URL}/resumes/improvements/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ improvementId }),
    });
    if (!res.ok) throw new Error("Failed to apply improvement");
    return res.json();
  },
};
