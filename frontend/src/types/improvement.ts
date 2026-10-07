export interface ResumeImprovement {
  id: string;
  section: "Summary" | "Experience" | "Projects" | "Skills" | "Achievements";
  originalText: string;
  suggestedText: string;
  reason: string;
  confidence: number; // 0.0 - 1.0
  metricsMissingNotice?: string; // e.g. "Add a measurable result if available"
  applied: boolean;
}
