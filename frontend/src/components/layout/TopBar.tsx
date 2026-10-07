"use client";

import React from "react";
import Link from "next/link";
import { FileText, CheckCircle2, Bot, UploadCloud, Menu, Sparkles } from "lucide-react";
import { useCareerLens } from "../../context/CareerLensContext";

interface TopBarProps {
  onToggleMobileMenu?: () => void;
}

export function TopBar({ onToggleMobileMenu }: TopBarProps) {
  const { activeResume, openCopilot, isDemoMode } = useCareerLens();

  return (
    <header className="h-16 glass-nav px-6 flex items-center justify-between sticky top-0 z-30 transition-all">
      {/* Left: Mobile trigger & active file info */}
      <div className="flex items-center gap-4">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden text-slate-600 hover:text-slate-900 p-1.5 rounded-lg border border-sky-200/80 bg-white/70"
            aria-label="Toggle navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        <div className="flex items-center gap-3">
          <div className="h-8.5 w-8.5 rounded-xl bg-sky-100/80 border border-sky-200/80 flex items-center justify-center text-sky-600 shadow-xs">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800 truncate max-w-[200px] sm:max-w-[280px]">
                {activeResume?.originalFilename || "Alex_Rivera_Resume.pdf"}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shadow-2xs">
                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                Verified & Ready
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium">
              {isDemoMode ? "Live Candidate Intelligence Profile" : "Candidate Document Loaded"}
            </p>
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Ask Gemini Copilot Button */}
        <button
          onClick={openCopilot}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-sky-500/15 to-indigo-500/15 text-sky-800 border border-sky-300 hover:bg-sky-500/25 hover:border-sky-400 transition-all shadow-xs cursor-pointer group"
        >
          <Sparkles className="h-3.5 w-3.5 text-sky-600 group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline">Ask Gemini Copilot</span>
          <span className="sm:hidden">Copilot</span>
        </button>

        {/* Upload Button */}
        <Link
          href="/upload"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-500 hover:to-blue-500 shadow-sm shadow-sky-600/25 transition-all"
        >
          <UploadCloud className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Upload Resume</span>
          <span className="sm:hidden">Upload</span>
        </Link>
      </div>
    </header>
  );
}
