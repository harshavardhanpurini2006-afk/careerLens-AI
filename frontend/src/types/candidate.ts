export type EvidenceConfidence = "FOUND" | "INFERRED" | "NOT_FOUND";

export interface CandidateEducation {
  institution: string;
  degree: string;
  field: string;
  startYear?: string;
  endYear?: string;
  gpa?: string; // May be "Not found in resume"
  status: EvidenceConfidence;
}

export interface CandidateExperience {
  company: string;
  title: string;
  duration?: string;
  location?: string;
  bullets: string[];
  technologies: string[];
  status: EvidenceConfidence;
}

export interface CandidateProject {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  bullets: string[];
  githubUrl?: string;
  liveUrl?: string;
  metricsPresent: boolean;
  deploymentPresent: boolean;
  status: EvidenceConfidence;
}

export type SkillTaxonomyCategory =
  | "Programming"
  | "Framework"
  | "Database"
  | "Databases"
  | "Data"
  | "Machine Learning"
  | "Deep Learning"
  | "Generative AI"
  | "Backend"
  | "Cloud"
  | "DevOps"
  | "MLOps"
  | "AI/ML"
  | "Tool"
  | "Concept";

export interface CandidateSkillItem {
  name: string;
  category: SkillTaxonomyCategory;
  confidence: EvidenceConfidence;
  evidenceSnippet?: string;
}

export interface CandidateProfile {
  id: string;
  resumeId: string;
  isDemo: boolean;
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  executiveSummary: string;
  yearsOfExperience: number;
  education: CandidateEducation[];
  workExperience: CandidateExperience[];
  projects: CandidateProject[];
  certifications: { name: string; issuer?: string; status: EvidenceConfidence }[];
  achievements: string[];
  publications: string[];
  skills: CandidateSkillItem[];
  missingSections: string[];
  createdAt: string;
}
