export type ResumeStatus = "pending" | "processing" | "parsed" | "analyzing" | "completed" | "failed";

export interface Resume {
  id: string;
  userId?: string;
  originalFilename: string;
  storedFilename: string;
  fileSizeBytes: number;
  mimeType: string;
  sha256Hash: string;
  rawText: string;
  cleanText: string;
  status: ResumeStatus;
  createdAt: string;
  updatedAt: string;
}

export interface UploadProgressStep {
  step: number;
  label: string;
  status: "waiting" | "in_progress" | "completed";
}

export interface ExtractedSectionSnippet {
  title: string;
  verified: boolean;
  content: string;
  itemCount?: number;
}
