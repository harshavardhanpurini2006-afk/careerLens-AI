import { SkillGapSummary } from "../types";
import { mockSkillGaps } from "./mockData";
import { simulateDelay, USE_MOCK, API_BASE_URL } from "./api";

export const skillGapService = {
  async getSkillGaps(resumeId: string, roleCode?: string): Promise<SkillGapSummary> {
    if (USE_MOCK) {
      await simulateDelay(250);
      return mockSkillGaps;
    }
    const url = roleCode
      ? `${API_BASE_URL}/resumes/${resumeId}/skills?role_id=${roleCode}`
      : `${API_BASE_URL}/resumes/${resumeId}/skills`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to load skill gaps");
    return res.json();
  },
};
