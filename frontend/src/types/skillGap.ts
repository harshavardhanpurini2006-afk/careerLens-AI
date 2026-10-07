export type SkillStatus = "Strong" | "Intermediate" | "Needs Improvement" | "Missing";

export type SkillCategory =
  | "Programming"
  | "Data"
  | "Machine Learning"
  | "Deep Learning"
  | "Generative AI"
  | "Backend"
  | "Databases"
  | "Cloud"
  | "DevOps"
  | "MLOps";

export interface SkillGapItem {
  id: string;
  skill: string;
  category: SkillCategory;
  currentStatus: SkillStatus;
  roleRequirement: "Required" | "Preferred" | "Bonus";
  importance: "Critical" | "High" | "Medium";
  evidence: string; // e.g. "Verified in Customer Churn project", or "Not found in resume"
  sourceSection?: string;
  reason: string;
  recommendedAction: string;
}

export interface SkillGapSummary {
  roleCode: string;
  roleName: string;
  totalSkills: number;
  strongCount: number;
  intermediateCount: number;
  needsImprovementCount: number;
  missingCount: number;
  categories: SkillCategory[];
  items: SkillGapItem[];
}
