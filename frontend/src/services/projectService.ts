import { ProjectAnalysis } from "../types";
import { mockProjectAnalyses } from "./mockData";
import { simulateDelay, USE_MOCK, API_BASE_URL } from "./api";

export const projectService = {
  async getProjectAnalyses(resumeId: string): Promise<ProjectAnalysis[]> {
    if (USE_MOCK) {
      await simulateDelay(250);
      return mockProjectAnalyses;
    }
    const res = await fetch(`${API_BASE_URL}/resumes/${resumeId}/projects`);
    if (!res.ok) throw new Error("Failed to load project analyses");
    return res.json();
  },

  async getProjectAnalysis(resumeId: string, projectId: string): Promise<ProjectAnalysis | undefined> {
    if (USE_MOCK) {
      await simulateDelay(150);
      return mockProjectAnalyses.find((p) => p.projectId === projectId || p.id === projectId) || mockProjectAnalyses[0];
    }
    const res = await fetch(`${API_BASE_URL}/resumes/${resumeId}/projects/${projectId}`);
    if (!res.ok) throw new Error("Failed to load project");
    return res.json();
  },
};
