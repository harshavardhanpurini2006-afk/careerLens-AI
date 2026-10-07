export interface HistoryRecord {
  id: string;
  resumeVersion: string;
  date: string;
  filename: string;
  resumeScore: number;
  atsScore: number;
  topRole: string;
  roleMatch: number;
  changeSummary: string;
}
