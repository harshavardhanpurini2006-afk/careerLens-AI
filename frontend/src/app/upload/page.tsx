"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "../../components/layout/AppShell";
import { useCareerLens } from "../../context/CareerLensContext";
import { resumeService } from "../../services/resumeService";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  FileCode,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function UploadPage() {
  const router = useRouter();
  const { setActiveResume, setCandidateProfile, resetToDemoData, activeResume } = useCareerLens();

  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentStepLabel, setCurrentStepLabel] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"upload" | "inspector">("upload");

  const allowedExtensions = [".pdf", ".docx", ".txt"];
  const maxSizeBytes = 10 * 1024 * 1024; // 10 MB

  const validateAndProcessFile = async (file: File) => {
    setErrorMessage(null);
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      setErrorMessage("Unsupported file type. Please upload a PDF, DOCX, or TXT resume document.");
      return;
    }
    if (file.size > maxSizeBytes) {
      setErrorMessage("File exceeds 10MB limit. Please provide a smaller document.");
      return;
    }

    setSelectedFile(file);
    setIsProcessing(true);

    try {
      const result = await resumeService.uploadResume(file, (step, label) => {
        setCurrentStepIndex(step);
        setCurrentStepLabel(label);
      });

      setActiveResume(result.resume);
      setCandidateProfile(result.profile);

      // Once complete, route to dashboard or allow inspection
      setTimeout(() => {
        setIsProcessing(false);
        setActiveTab("inspector");
      }, 500);
    } catch {
      setErrorMessage("Failed to process resume. Please try again.");
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const handleLoadDemo = () => {
    resetToDemoData();
    setActiveTab("inspector");
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-sky-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-sky-700 uppercase tracking-wider bg-sky-100/80 px-2 py-0.5 rounded-full border border-sky-200">
                Document Ingestion Engine
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Resume Upload Studio
            </h1>
          </div>

          <div className="flex items-center gap-2 bg-white/70 p-1 rounded-xl border border-sky-100">
            <button
              onClick={() => setActiveTab("upload")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === "upload"
                  ? "bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Upload Document
            </button>
            <button
              onClick={() => setActiveTab("inspector")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === "inspector"
                  ? "bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Extracted Text Inspector
            </button>
          </div>
        </div>

        {/* Tab 1: Upload Dropzone */}
        {activeTab === "upload" && (
          <div className="space-y-6">
            {/* Dropzone Container */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`rounded-3xl border-2 border-dashed p-8 sm:p-12 text-center transition-all glass-panel ${
                isDragging
                  ? "border-sky-500 bg-sky-50 scale-[1.01]"
                  : "border-sky-200/90 bg-white/70 hover:border-sky-400 hover:bg-sky-50/40"
              }`}
            >
              <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-tr from-sky-100 to-blue-100 border border-sky-200 flex items-center justify-center text-sky-600 mb-4 shadow-sm">
                <UploadCloud className="h-8 w-8" />
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Drag & Drop your Resume (PDF, DOCX, TXT)
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6 leading-relaxed">
                Max 10MB. Document is sanitized, section-parsed, and evaluated under our strict Zero-Fabrication protocol with Gemini AI.
              </p>

              <label className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-500 hover:to-blue-500 shadow-md shadow-sky-600/25 cursor-pointer transition-all">
                <FileText className="h-4 w-4" />
                <span>Browse Local Document</span>
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={isProcessing}
                />
              </label>

              {/* Quick Demo Option */}
              <div className="mt-8 pt-6 border-t border-sky-100 flex flex-col sm:flex-row items-center justify-center gap-3">
                <span className="text-xs text-slate-500 font-medium">Want to see instant recruiter analysis?</span>
                <button
                  type="button"
                  onClick={handleLoadDemo}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Load Sample Candidate (Alex Rivera)</span>
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50/90 p-4 flex items-center gap-3 text-rose-700 text-xs font-medium shadow-2xs">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Simulated 7-Step Progress Stepper */}
            {isProcessing && (
              <div className="rounded-2xl border border-sky-200 bg-white/95 p-6 space-y-4 shadow-lg shadow-sky-950/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-sky-500 animate-ping" />
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Processing: {selectedFile?.name}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                    Step {currentStepIndex} of 7
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-sky-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-sky-500 to-blue-600 h-2.5 transition-all duration-300"
                    style={{ width: `${(currentStepIndex / 7) * 100}%` }}
                  />
                </div>

                <div className="text-xs text-slate-600 font-medium italic flex items-center gap-2">
                  <span>{currentStepLabel}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Extracted Text Inspector */}
        {activeTab === "inspector" && (
          <div className="space-y-6">
            <div className="rounded-3xl glass-panel p-6 border border-sky-100/90 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-sky-100">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600">
                    <FileCode className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Extracted Document Stream</h3>
                    <p className="text-xs text-slate-500">
                      {activeResume?.originalFilename} ({activeResume?.mimeType || "text/plain"})
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => router.push("/dashboard")}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-500 hover:to-blue-500 shadow-sm shadow-sky-600/20 transition-all cursor-pointer"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="mt-4 p-4 rounded-2xl bg-white/90 border border-sky-100 max-h-96 overflow-y-auto font-mono text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                {activeResume?.rawText ||
                  "Alex Rivera\nalex.rivera@example.com | (512) 555-0199 | Austin, TX\n\nSUMMARY\nDriven Artificial Intelligence & Data Science graduate with hands-on experience in predictive modeling...\n\nSKILLS\nPython, SQL, Machine Learning, Scikit-Learn, Pandas, NumPy, FastAPI, Docker\n\nPROJECTS\nCustomer Churn Classifier | Scikit-Learn, Pandas\nStudent Performance Analytics | Python, SQL"}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
