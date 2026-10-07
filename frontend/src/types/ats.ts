export interface ATSSubScore {
  name: string;
  score: number; // 0-100
  weight: number;
  status: "good" | "warning" | "critical";
  feedback: string;
}

export interface ATSIssue {
  id: string;
  category: "Formatting" | "Section" | "Metrics" | "Keywords" | "Contact";
  severity: "critical" | "warning" | "suggestion";
  title: string;
  description: string;
  suggestedFix: string;
  beforeSnippet?: string;
  afterSnippet?: string;
  applied?: boolean;
}

export interface ATSResult {
  overallScore: number; // 0-100
  readinessLevel: "High" | "Moderate" | "Needs Optimization";
  summary: string;
  subScores: ATSSubScore[];
  detectedSections: { name: string; standard: boolean }[];
  parseabilityFlags: {
    tablesDetected: boolean;
    multiColumnsDetected: boolean;
    nonStandardFonts: boolean;
    unusualSymbols: boolean;
  };
  issues: ATSIssue[];
}
