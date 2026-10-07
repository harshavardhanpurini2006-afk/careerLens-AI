"use client";

import React, { useState } from "react";
import { AppShell } from "../../components/layout/AppShell";
import { ScoreGauge } from "../../components/ui/ScoreGauge";
import { mockJDComparison } from "../../services/mockData";
import { jobService } from "../../services/jobService";
import { JDComparison } from "../../types";
import {
  GitCompare,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  FileText,
} from "lucide-react";

const SAMPLE_JD = `Role: Junior AI / ML Engineer
Company: NexusAI Technologies
Location: Austin, TX / Remote

Requirements:
- Strong proficiency in Python, Pandas, and NumPy for data manipulation.
- Experience training supervised machine learning models (Classification & Regression).
- Working knowledge of SQL for database querying and data extraction.
- Understanding of neural networks and deep learning frameworks (PyTorch or TensorFlow).
- Experience with Docker containerization and REST APIs (FastAPI/Flask) for model serving.
- Familiarity with cloud platforms (AWS/GCP) and CI/CD pipelines is a plus.`;

export default function JDMatcherPage() {
  const [jdText, setJdText] = useState(SAMPLE_JD);
  const [comparison, setComparison] = useState<JDComparison | null>(mockJDComparison);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!jdText.trim()) return;
    setIsAnalyzing(true);
    try {
      const result = await jobService.compareJobDescription("res-demo-001", jdText);
      setComparison(result);
    } catch {
      // Keep existing comparison
    } finally {
      setIsAnalyzing(false);
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
                Split-Screen Match Engine
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Job Description (JD) Comparator
            </h1>
          </div>

          <button
            onClick={() => setJdText(SAMPLE_JD)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white/90 border border-sky-200 text-sky-800 hover:bg-sky-50 transition-colors cursor-pointer shadow-2xs"
          >
            <Sparkles className="h-3.5 w-3.5 text-sky-600" />
            <span>Load Sample AI Engineer JD</span>
          </button>
        </div>

        {/* Split Screen Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: JD Input */}
          <div className="lg:col-span-5 rounded-3xl glass-panel p-6 border border-sky-100/90 flex flex-col justify-between space-y-4 shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="h-4 w-4 text-sky-600" />
                  Target Job Description
                </span>
                <span className="text-[11px] text-slate-500 font-medium">Paste job post requirements</span>
              </div>
              <textarea
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                placeholder="Paste Job Description text here..."
                rows={16}
                className="w-full glass-input rounded-2xl p-4 font-mono text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 leading-relaxed resize-none shadow-2xs"
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !jdText.trim()}
              className="w-full py-3 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-500 hover:to-blue-500 shadow-md shadow-sky-600/25 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <span className="h-3.5 w-3.5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  <span>Extracting & Comparing Signals...</span>
                </>
              ) : (
                <>
                  <GitCompare className="h-4 w-4" />
                  <span>Compare Resume vs Job Description</span>
                </>
              )}
            </button>
          </div>

          {/* Right Column: Comparison Result */}
          <div className="lg:col-span-7 space-y-6">
            {comparison && (
              <>
                {/* Score Header */}
                <div className="rounded-3xl glass-panel p-6 border border-sky-100/90 flex items-center justify-between shadow-sm">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] bg-sky-100 text-sky-800 border border-sky-300 px-2 py-0.5 rounded-full font-bold">
                        {comparison.seniority}
                      </span>
                      <span className="text-xs text-slate-500 font-semibold">
                        {comparison.companyName}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">{comparison.targetRole}</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Matched against candidate verified credentials
                    </p>
                  </div>
                  <ScoreGauge score={comparison.overallMatch} size={88} strokeWidth={8} label="JD Fit" />
                </div>

                {/* Matched Requirements with quotes */}
                <div className="rounded-3xl border border-emerald-200 bg-white/90 p-6 space-y-3 shadow-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600" />
                    <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                      Matched JD Requirements ({comparison.matchedRequirements.length})
                    </h4>
                  </div>
                  <div className="space-y-2.5">
                    {comparison.matchedRequirements.map((req, i) => (
                      <div
                        key={i}
                        className="rounded-2xl border border-sky-100 bg-white p-3.5 text-xs space-y-1 shadow-2xs"
                      >
                        <div className="font-bold text-slate-900">{req.requirement}</div>
                        <div className="text-slate-500 italic text-[11px]">
                          Resume evidence: "{req.evidenceQuote}"
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Missing Critical Requirements */}
                <div className="rounded-3xl border border-rose-200 bg-white/90 p-6 space-y-3 shadow-xs">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4.5 w-4.5 text-rose-600" />
                    <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider">
                      Missing Critical Requirements ({comparison.missingCriticalRequirements.length})
                    </h4>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-700 font-medium">
                    {comparison.missingCriticalRequirements.map((mis, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0 mt-1" />
                        <span>{mis}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Keyword Gaps & Suggested Bullet Tweaks */}
                <div className="rounded-3xl glass-panel p-6 border border-sky-100/90 space-y-4 shadow-sm">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
                      Missing Keywords for this Role
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {comparison.keywordGaps.map((kw, i) => (
                        <span
                          key={i}
                          className="text-[10px] bg-amber-50 border border-amber-200 text-amber-800 font-bold px-2.5 py-1 rounded-full shadow-2xs"
                        >
                          + {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-sky-100">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
                      Suggested Bullet Point Tweaks for this JD
                    </h4>
                    <div className="space-y-3">
                      {comparison.suggestedBulletTweaks.map((tweak, i) => (
                        <div key={i} className="rounded-2xl border border-sky-100 bg-white/90 p-3.5 text-xs space-y-1.5 shadow-2xs">
                          <div className="text-slate-400 line-through">"{tweak.originalBullet}"</div>
                          <div className="text-sky-950 font-bold">"{tweak.tailoredBullet}"</div>
                          <span className="text-[10px] text-sky-700 font-semibold block">
                            Target Keyword Added: {tweak.targetKeyword}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
