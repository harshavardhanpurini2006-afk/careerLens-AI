"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Resume,
  CandidateProfile,
  RecruiterAnalysis,
  RoleCode,
} from "../types";
import {
  mockResume,
  mockCandidateProfile,
  mockRecruiterAnalysis,
} from "../services/mockData";

interface CareerLensContextType {
  activeResume: Resume | null;
  candidateProfile: CandidateProfile | null;
  recruiterAnalysis: RecruiterAnalysis | null;
  selectedRoleCode: RoleCode;
  isCopilotOpen: boolean;
  toggleCopilot: () => void;
  openCopilot: () => void;
  closeCopilot: () => void;
  setSelectedRoleCode: (role: RoleCode) => void;
  setActiveResume: (resume: Resume) => void;
  setCandidateProfile: (profile: CandidateProfile) => void;
  resetToDemoData: () => void;
  clearAllData: () => void;
  isDemoMode: boolean;
}

const CareerLensContext = createContext<CareerLensContextType | undefined>(undefined);

export function CareerLensProvider({ children }: { children: React.ReactNode }) {
  const [activeResume, setActiveResumeState] = useState<Resume | null>(mockResume);
  const [candidateProfile, setCandidateProfileState] = useState<CandidateProfile | null>(
    mockCandidateProfile
  );
  const [recruiterAnalysis, setRecruiterAnalysisState] = useState<RecruiterAnalysis | null>(
    mockRecruiterAnalysis
  );
  const [selectedRoleCode, setSelectedRoleCode] = useState<RoleCode>("ai_engineer");
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(true);

  // Load persisted state if available
  useEffect(() => {
    try {
      const savedResume = localStorage.getItem("careerlens_active_resume");
      if (savedResume) {
        setActiveResumeState(JSON.parse(savedResume));
      }
      const savedRole = localStorage.getItem("careerlens_selected_role");
      if (savedRole) {
        setSelectedRoleCode(savedRole as RoleCode);
      }
    } catch {
      // Ignore localStorage errors (e.g., SSR or incognito quota)
    }
  }, []);

  const setActiveResume = (resume: Resume) => {
    setActiveResumeState(resume);
    try {
      localStorage.setItem("careerlens_active_resume", JSON.stringify(resume));
    } catch {
      // Ignore
    }
  };

  const setCandidateProfile = (profile: CandidateProfile) => {
    setCandidateProfileState(profile);
  };

  const handleSetRole = (role: RoleCode) => {
    setSelectedRoleCode(role);
    try {
      localStorage.setItem("careerlens_selected_role", role);
    } catch {
      // Ignore
    }
  };

  const toggleCopilot = () => setIsCopilotOpen((prev) => !prev);
  const openCopilot = () => setIsCopilotOpen(true);
  const closeCopilot = () => setIsCopilotOpen(false);

  const resetToDemoData = () => {
    setActiveResumeState(mockResume);
    setCandidateProfileState(mockCandidateProfile);
    setRecruiterAnalysisState(mockRecruiterAnalysis);
    setSelectedRoleCode("ai_engineer");
    setIsDemoMode(true);
    try {
      localStorage.removeItem("careerlens_active_resume");
      localStorage.removeItem("careerlens_selected_role");
    } catch {
      // Ignore
    }
  };

  const clearAllData = () => {
    setActiveResumeState(null);
    setCandidateProfileState(null);
    setRecruiterAnalysisState(null);
    setIsDemoMode(false);
    try {
      localStorage.clear();
    } catch {
      // Ignore
    }
  };

  return (
    <CareerLensContext.Provider
      value={{
        activeResume,
        candidateProfile,
        recruiterAnalysis,
        selectedRoleCode,
        isCopilotOpen,
        toggleCopilot,
        openCopilot,
        closeCopilot,
        setSelectedRoleCode: handleSetRole,
        setActiveResume,
        setCandidateProfile,
        resetToDemoData,
        clearAllData,
        isDemoMode,
      }}
    >
      {children}
    </CareerLensContext.Provider>
  );
}

export function useCareerLens() {
  const context = useContext(CareerLensContext);
  if (!context) {
    throw new Error("useCareerLens must be used within a CareerLensProvider");
  }
  return context;
}
