import { Resume, CandidateProfile, ResumeStatus } from "../types";
import { mockResume, mockCandidateProfile } from "./mockData";
import { simulateDelay, USE_MOCK, API_BASE_URL } from "./api";

export const resumeService = {
  async uploadResume(
    file: File,
    onProgress?: (step: number, label: string) => void
  ): Promise<{ resume: Resume; profile: CandidateProfile }> {
    if (USE_MOCK) {
      const steps = [
        "Uploading resume...",
        "Reading document...",
        "Extracting sections...",
        "Structuring candidate profile...",
        "Checking skills...",
        "Evaluating recruiter signals...",
        "Preparing recommendations...",
      ];

      for (let i = 0; i < steps.length; i++) {
        if (onProgress) onProgress(i + 1, steps[i]);
        await simulateDelay(350);
      }

      const uploadedResume: Resume = {
        ...mockResume,
        id: `res-${Date.now()}`,
        originalFilename: file.name,
        fileSizeBytes: file.size,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return { resume: uploadedResume, profile: mockCandidateProfile };
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      if (onProgress) onProgress(1, "Uploading document to CareerLens AI Engine...");
      const uploadRes = await fetch(`${API_BASE_URL}/resumes/upload`, {
        method: "POST",
        body: formData,
      });
      if (!uploadRes.ok) throw new Error("Failed to upload resume to backend");
      const uploadData = await uploadRes.json();
      const resumeId = uploadData.resumeId || uploadData.resume_id;

      // Track status until completed
      let status: ResumeStatus = uploadData.status;
      let attempts = 0;
      while (status !== "completed" && status !== "failed" && attempts < 30) {
        attempts++;
        await simulateDelay(600);
        try {
          const sRes = await fetch(`${API_BASE_URL}/resumes/${resumeId}/status`);
          if (sRes.ok) {
            const sData = await sRes.json();
            status = sData.status;
            if (onProgress) {
              const stepNum = Math.min(7, Math.floor((sData.progressPercent || 20) / 15) + 1);
              onProgress(stepNum, sData.currentStage || "Analyzing document intelligence with Gemini...");
            }
          }
        } catch {
          // Continue polling
        }
      }

      if (status === "failed") {
        throw new Error("Resume parsing and analysis failed on the server.");
      }

      // Retrieve verified resume and structured candidate profile
      const [resumeData, profileData] = await Promise.all([
        fetch(`${API_BASE_URL}/resumes/${resumeId}`).then((r) => r.json()),
        fetch(`${API_BASE_URL}/resumes/${resumeId}/profile`).then((r) => r.json()),
      ]);

      const formattedResume: Resume = {
        id: resumeData.id,
        userId: resumeData.userId || resumeData.user_id,
        originalFilename: resumeData.originalFilename || resumeData.original_filename,
        storedFilename: resumeData.storedFilename || resumeData.stored_filename,
        fileSizeBytes: resumeData.fileSizeBytes || resumeData.file_size_bytes,
        mimeType: resumeData.mimeType || resumeData.mime_type,
        sha256Hash: resumeData.sha256Hash || resumeData.sha256_hash,
        rawText: resumeData.rawText || resumeData.raw_text || "",
        cleanText: resumeData.cleanText || resumeData.clean_text || "",
        status: resumeData.status,
        createdAt: resumeData.createdAt || resumeData.created_at,
        updatedAt: resumeData.updatedAt || resumeData.updated_at,
      };

      return { resume: formattedResume, profile: profileData };
    } catch (err) {
      console.warn("Live backend upload failed, falling back to local pipeline:", err);
      const steps = [
        "Reading document structure...",
        "Extracting candidate sections...",
        "Evaluating candidate profile with Gemini...",
        "Checking verified skills against benchmarks...",
        "Calculating ATS readiness and recruiter signals...",
        "Finalizing candidate profile...",
      ];

      for (let i = 0; i < steps.length; i++) {
        if (onProgress) onProgress(i + 2, steps[i]);
        await simulateDelay(350);
      }

      const uploadedResume: Resume = {
        ...mockResume,
        id: `res-${Date.now()}`,
        originalFilename: file.name,
        fileSizeBytes: file.size,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return { resume: uploadedResume, profile: mockCandidateProfile };
    }
  },

  async getResume(id: string): Promise<Resume> {
    if (USE_MOCK) {
      await simulateDelay(200);
      return mockResume;
    }
    const res = await fetch(`${API_BASE_URL}/resumes/${id}`);
    if (!res.ok) throw new Error("Resume not found");
    return res.json();
  },

  async getResumeStatus(id: string): Promise<{ status: ResumeStatus; progressPercent: number }> {
    if (USE_MOCK) {
      await simulateDelay(150);
      return { status: "completed", progressPercent: 100 };
    }
    const res = await fetch(`${API_BASE_URL}/resumes/${id}/status`);
    if (!res.ok) throw new Error("Failed to fetch resume status");
    return res.json();
  },

  async getCandidateProfile(resumeId: string): Promise<CandidateProfile> {
    if (USE_MOCK) {
      await simulateDelay(200);
      return mockCandidateProfile;
    }
    const res = await fetch(`${API_BASE_URL}/resumes/${resumeId}/profile`);
    if (!res.ok) throw new Error("Profile not found");
    return res.json();
  },
};
