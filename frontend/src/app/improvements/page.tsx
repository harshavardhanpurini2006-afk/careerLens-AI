"use client";

import React, { useState } from "react";
import { AppShell } from "../../components/layout/AppShell";
import { mockResumeImprovements } from "../../services/mockData";
import { improvementService } from "../../services/improvementService";
import { Sparkles, CheckCircle2, ShieldCheck, ArrowRight, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function ImprovementsPage() {
  const [improvements, setImprovements] = useState(mockResumeImprovements);

  const handleApply = async (id: string) => {
    const res = await improvementService.applyImprovement(id);
    if (res.success) {
      setImprovements((prev) =>
        prev.map((item) => (item.id === id ? { ...item, applied: true } : item))
      );
    }
  };

  return (
    <AppShell>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-sky-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-sky-700 uppercase tracking-wider bg-sky-100 px-2.5 py-0.5 rounded-full border border-sky-200">
                Recruiter-Grade Bullet Rewriting
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Resume Improvement Studio
            </h1>
          </div>

          <Link
            href="/roadmap"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-500 hover:to-blue-500 shadow-md shadow-sky-600/25 transition-all"
          >
            <span>See Upskilling Roadmap</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Zero-Fabrication Trust Banner */}
        <div className="rounded-3xl border border-sky-200 bg-sky-50/80 p-5 sm:p-6 flex items-start gap-3.5 shadow-xs">
          <div className="h-9 w-9 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-sky-900 uppercase tracking-wider">
              Zero-Fabrication Rewriting Standard
            </h3>
            <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-normal">
              Our rewriter strengthens active verbs, sentence cadence, and STAR methodology strictly using verified facts. When numbers are absent, we will never invent them — we prompt you to fill in your real verified metrics.
            </p>
          </div>
        </div>

        {/* Improvements List */}
        <div className="space-y-5">
          {improvements.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl glass-panel p-6 sm:p-7 border border-sky-100/90 space-y-4 shadow-sm hover:border-sky-300 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold bg-sky-100 text-sky-800 px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-sky-200">
                    {item.section}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">
                    Confidence: {Math.round(item.confidence * 100)}%
                  </span>
                </div>

                <button
                  onClick={() => handleApply(item.id)}
                  disabled={item.applied}
                  className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    item.applied
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default"
                      : "bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-500 hover:to-blue-500 shadow-xs"
                  }`}
                >
                  {item.applied ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Applied to Resume</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Apply Suggestion</span>
                    </>
                  )}
                </button>
              </div>

              {/* Side by side original vs suggested */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Original Text
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed italic font-normal">
                    "{item.originalText}"
                  </p>
                </div>

                <div className="rounded-2xl border border-sky-200 bg-sky-50/80 p-4 space-y-1.5 shadow-2xs">
                  <span className="text-[10px] font-bold text-sky-800 uppercase tracking-wider block">
                    Recruiter-Enhanced Rewrite
                  </span>
                  <p className="text-xs text-sky-950 font-bold leading-relaxed">
                    "{item.suggestedText}"
                  </p>
                </div>
              </div>

              {/* Why it was rewritten */}
              <div className="pt-2 text-xs text-slate-600 flex items-start gap-2">
                <span className="text-slate-800 font-bold shrink-0">Recruiter Rationale:</span>
                <span className="font-normal">{item.reason}</span>
              </div>

              {item.metricsMissingNotice && (
                <div className="flex items-center gap-2 text-xs text-amber-800 bg-amber-50 border border-amber-200 px-3.5 py-2 rounded-xl font-medium">
                  <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
                  <span>{item.metricsMissingNotice}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
