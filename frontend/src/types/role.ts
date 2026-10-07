export type RoleCode =
  | "ai_engineer"
  | "ml_engineer"
  | "genai_engineer"
  | "data_scientist"
  | "data_analyst"
  | "data_engineer"
  | "python_developer"
  | "backend_developer"
  | "nlp_engineer"
  | "computer_vision_engineer"
  | "mlops_engineer";

export interface RoleSkillItem {
  name: string;
  isRequired: boolean;
  weight: number;
  importance: "critical" | "high" | "medium" | "bonus";
}

export interface RadarDataPoint {
  dimension: string;
  candidateScore: number;
  benchmarkScore: number;
}

export interface JobRole {
  id: string;
  roleCode: RoleCode;
  displayName: string;
  category: "AI/ML" | "Data" | "Software";
  description: string;
  experienceExpectations: string;
  commonTools: string[];
  projectExpectations: string[];
  interviewTopics: string[];
  requiredSkills: string[];
  preferredSkills: string[];
}

export interface RoleFit {
  roleCode: RoleCode;
  roleName: string;
  category: "AI/ML" | "Data" | "Software";
  deterministicScore: number; // 0-100
  requiredSkillCoverage: number; // 0-100
  preferredSkillCoverage: number; // 0-100
  projectRelevanceScore: number; // 0-100
  experienceRelevanceScore: number; // 0-100
  keywordScore: number; // 0-100
  matchedSkills: string[];
  missingSkills: string[];
  priorityGaps: string[];
  whyItFits: string;
  recruiterConcerns: string[];
  radarMetrics: RadarDataPoint[];
  recommendedProjects: string[];
  learningPriorities: string[];
}
