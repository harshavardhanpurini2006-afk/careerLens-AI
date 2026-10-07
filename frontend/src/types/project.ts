export interface STARBreakdown {
  situation: string;
  task: string;
  action: string;
  result: string; // "Not found in resume - add quantified metrics if available"
}

export interface ProjectAnalysis {
  id: string;
  projectId: string;
  title: string;
  overallScore: number; // 0-100
  problemClarityScore: number;
  technicalComplexityScore: number;
  businessRelevanceScore: number;
  technologyDepthScore: number;
  mlAiDepthScore: number;
  deploymentScore: number;
  testingScore: number;
  documentationScore: number;
  starAlignmentScore: number;
  starBreakdown: STARBreakdown;
  strengths: string[];
  weaknesses: string[];
  recruiterQuestions: string[];
  improvementPlan: string[];
}
