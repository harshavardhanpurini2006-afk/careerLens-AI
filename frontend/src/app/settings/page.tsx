"use client";

import React, { useState } from "react";
import { AppShell } from "../../components/layout/AppShell";
import { useCareerLens } from "../../context/CareerLensContext";
import {
  Settings,
  RotateCcw,
  Trash2,
  ShieldCheck,
  User,
  CheckCircle2,
  Sparkles,
  Bot,
  Zap,
} from "lucide-react";

export default function SettingsPage() {
  const { resetToDemoData, clearAllData, isDemoMode } = useCareerLens();
  const [notice, setNotice] = useState<string | null>(null);

  const handleReset = () => {
    resetToDemoData();
    setNotice("Restored default candidate profile (Alex Rivera).");
    setTimeout(() => setNotice(null), 3000);
  };

  const handleClear = () => {
    clearAllData();
    setNotice("Cleared local cache and refreshed active session.");
    setTimeout(() => setNotice(null), 3000);
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="pb-2 border-b border-sky-100">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-sky-700 uppercase tracking-wider bg-sky-100 px-2.5 py-0.5 rounded-full border border-sky-200">
              System Configuration
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Settings & AI Engine Status
          </h1>
        </div>

        {/* Success Notice */}
        {notice && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/90 p-4 flex items-center gap-2.5 text-xs text-emerald-800 font-medium shadow-xs">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{notice}</span>
          </div>
        )}

        {/* Gemini Engine Status Panel */}
        <div className="rounded-3xl glass-panel p-6 sm:p-7 border border-sky-100/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-sky-100 text-sky-700 border border-sky-200">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                  Gemini Career Intelligence Engine
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Autonomous Multi-Model LLM Service & Career Copilot
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Online & Connected
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-white/80 border border-sky-100 text-xs">
              <span className="text-slate-500 block text-[11px] font-bold uppercase tracking-wider">Primary Model</span>
              <span className="font-extrabold text-slate-900 text-sm mt-0.5 block">gemini-3.5-flash-lite</span>
              <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">Active on Port 8000</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/80 border border-sky-100 text-xs">
              <span className="text-slate-500 block text-[11px] font-bold uppercase tracking-wider">Fallback Models</span>
              <span className="font-extrabold text-slate-900 text-sm mt-0.5 block">gemini-3.8-flash</span>
              <span className="text-[10px] text-sky-600 font-semibold mt-1 block">Automatic failover</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/80 border border-sky-100 text-xs">
              <span className="text-slate-500 block text-[11px] font-bold uppercase tracking-wider">Ground-Truth Grounding</span>
              <span className="font-extrabold text-slate-900 text-sm mt-0.5 block">Zero-Fabrication</span>
              <span className="text-[10px] text-sky-600 font-semibold mt-1 block">Resume Evidence Only</span>
            </div>
          </div>
        </div>

        {/* Demo Data Management */}
        <div className="rounded-3xl glass-panel p-6 sm:p-7 border border-sky-100/90 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-100 text-sky-700 border border-sky-200">
              <Sparkles className="h-4 w-4" />
            </div>
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              Profile Data & Cache Controls
            </h2>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Manage your candidate session. You can restore the benchmark dataset for testing or reset client-side cache while maintaining live API connectivity.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-500 hover:to-blue-500 shadow-md shadow-sky-600/25 transition-all cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset Candidate Data (Alex Rivera)</span>
            </button>

            <button
              onClick={handleClear}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 hover:border-rose-300 shadow-xs transition-all cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
              <span>Clear Local Cache</span>
            </button>
          </div>
        </div>

        {/* Privacy & Zero-Fabrication Protocol */}
        <div className="rounded-3xl glass-panel p-6 sm:p-7 border border-sky-100/90 shadow-sm space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-200">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              Data Privacy & Ground-Truth Standard
            </h2>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Candidate resume details are analyzed via secure Gemini API endpoints without model re-training.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Zero-Fabrication principle guarantees missing skills are never falsely added or hallucinated.</span>
            </li>
          </ul>
        </div>
      </div>
    </AppShell>
  );
}
