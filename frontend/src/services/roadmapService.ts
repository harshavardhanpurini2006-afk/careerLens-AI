import { CareerRoadmap } from "../types";
import { mockCareerRoadmap } from "./mockData";
import { simulateDelay, USE_MOCK, API_BASE_URL } from "./api";

export const roadmapService = {
  async getRoadmap(resumeId: string, roleCode?: string): Promise<CareerRoadmap> {
    if (USE_MOCK) {
      await simulateDelay(250);
      return mockCareerRoadmap;
    }
    const url = roleCode
      ? `${API_BASE_URL}/resumes/${resumeId}/roadmap?role_id=${roleCode}`
      : `${API_BASE_URL}/resumes/${resumeId}/roadmap`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to load career roadmap");
    return res.json();
  },
};
