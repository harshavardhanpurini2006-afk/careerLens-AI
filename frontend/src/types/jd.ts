export interface MatchedRequirement {
  requirement: string;
  evidenceQuote: string;
  strength: "High" | "Moderate";
}

export interface JDComparison {
  id: string;
  targetRole: string;
  companyName?: string;
  seniority: "Intern" | "Entry-Level" | "Mid-Level" | "Senior";
  overallMatch: number; // 0-100
  matchedRequirements: MatchedRequirement[];
  missingCriticalRequirements: string[];
  preferredRequirements: string[];
  keywordGaps: string[];
  priorityActions: string[];
  suggestedBulletTweaks: {
    originalBullet: string;
    tailoredBullet: string;
    targetKeyword: string;
  }[];
}
