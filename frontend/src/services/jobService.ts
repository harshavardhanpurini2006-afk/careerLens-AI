import { JDComparison } from "../types";
import { mockJDComparison } from "./mockData";
import { simulateDelay, USE_MOCK, API_BASE_URL } from "./api";

export const jobService = {
  async compareJobDescription(resumeId: string, jdText: string): Promise<JDComparison> {
    if (USE_MOCK) {
      await simulateDelay(600); // realistic comparison delay
      return mockJDComparison;
    }
    const res = await fetch(`${API_BASE_URL}/job-descriptions/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resume_id: resumeId, jd_text: jdText }),
    });
    if (!res.ok) throw new Error("Failed to analyze job description");
    return res.json();
  },
};
