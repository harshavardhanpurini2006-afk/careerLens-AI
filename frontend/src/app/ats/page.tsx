"use client";

import React, { useState } from "react";
import { AppShell } from "../../components/layout/AppShell";
import { ScoreGauge } from "../../components/ui/ScoreGauge";
import { mockATSResult } from "../../services/mockData";
import { atsService } from "../../services/atsService";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  FileCheck2,
} from "lucide-react";
import Link from "next/link";

export default function ATSPage() {
  const [atsData, setAtsData] = useState(mockATSResult);
  const [appliedFixes, setAppliedFixes] = useState<Record<string, boolean>>({});

  const handleApplyFix = async (issueId: string) => {
    const res = await atsService.applyFix(issueId);
    if (res.success) {
      setAppliedFixes((prev) => ({ ...prev, [issueId]: true }));
      setAtsData((prev) => ({
        ...prev,
        overallScore: Math.min(100, prev.overallScore + 3),
      }));
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
                ATS Compatibility Engine
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Applicant Tracking System (ATS) Scanner
            </h1>
          </div>

          <Link
            href="/improvements"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-500 hover:to-blue-500 shadow-md shadow-sky-600/25 transition-all"
          >
            <span>Resume Improvement Studio</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Top Summary Card */}
        <div className="rounded-3xl glass-panel p-6 sm:p-7 border border-sky-100/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                Moderate Readiness (76%)
              </span>
              <span className="text-xs font-medium text-slate-500">Standard Single-Column Layout</span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-2">
              Parseability is High, but Metric & Keyword Density Need Tuning
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              {atsData.summary}
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <ScoreGauge
              score={atsData.overallScore}
              size={100}
              strokeWidth={9}
              label="ATS Score"
            />
          </div>
        </div>

        {/* 8 Dimension Sub-Scores */}
        <div className="rounded-3xl glass-panel p-6 sm:p-7 border border-sky-100/90 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Diagnostic Dimensions & Sub-Scores
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {atsData.subScores.map((sub, i) => (
              <div
                key={i}
                className="rounded-2xl border border-sky-100 bg-white/90 p-4 space-y-2.5 shadow-2xs hover:border-sky-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">{sub.name}</span>
                  <span
                    className={`text-xs font-extrabold ${
                      sub.score >= 80
                        ? "text-emerald-700"
                        : sub.score >= 60
                        ? "text-amber-700"
                        : "text-rose-700"
                    }`}
                  >
                    {sub.score}%
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-sky-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full ${
                      sub.score >= 80
                        ? "bg-emerald-500"
                        : sub.score >= 60
                        ? "bg-amber-500"
                        : "bg-rose-500"
                    }`}
                    style={{ width: `${sub.score}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed font-normal">{sub.feedback}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Parseability Checklist */}
        <div className="rounded-3xl glass-panel p-6 sm:p-7 border border-sky-100/90 shadow-sm space-y-3.5">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Layout & Parser Health Check
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {[
              { label: "Tables Detected", val: "None (Pass)", pass: true },
              { label: "Multi-Columns", val: "Single (Pass)", pass: true },
              { label: "Standard Fonts", val: "Arial/Sans (Pass)", pass: true },
              { label: "Section Headers", val: "6 Standard (Pass)", pass: true },
            ].map((check, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-sky-100 bg-white/90 p-3.5 flex items-center justify-between shadow-2xs"
              >
                <div>
                  <span className="text-[11px] text-slate-500 block font-medium">{check.label}</span>
                  <span className="font-bold text-emerald-700">{check.val}</span>
                </div>
                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Actionable Before / After Fixes */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Actionable Fixes & Sentence Rewrites
              </h3>
              <p className="text-xs text-slate-500 font-medium">Line-by-line quantifiable improvements</p>
            </div>
            <span className="text-xs font-bold text-sky-800 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200">
              {atsData.issues.length} Optimization Opportunities Found
            </span>
          </div>

          <div className="space-y-4">
            {atsData.issues.map((issue) => {
              const isApplied = appliedFixes[issue.id];

              return (
                <div
                  key={issue.id}
                  className="rounded-3xl glass-panel p-5 sm:p-6 border border-sky-100/90 space-y-3.5 shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                          issue.severity === "critical"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        {issue.severity}
                      </span>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900">{issue.title}</h4>
                    </div>

                    <button
                      onClick={() => handleApplyFix(issue.id)}
                      disabled={isApplied}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isApplied
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default"
                          : "bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-500 hover:to-blue-500 shadow-xs"
                      }`}
                    >
                      {isApplied ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Applied</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>Apply Suggested Fix</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal">{issue.description}</p>

                  {issue.beforeSnippet && issue.afterSnippet && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-3.5 text-xs">
                        <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block mb-1">
                          Current Text in Resume
                        </span>
                        <p className="text-slate-700 italic font-medium">"{issue.beforeSnippet}"</p>
                      </div>

                      <div className="rounded-2xl border border-sky-200 bg-sky-50/80 p-3.5 text-xs">
                        <span className="text-[10px] font-bold text-sky-800 uppercase tracking-wider block mb-1">
                          ATS Optimized Rewrite
                        </span>
                        <p className="text-sky-950 font-bold">"{issue.afterSnippet}"</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
