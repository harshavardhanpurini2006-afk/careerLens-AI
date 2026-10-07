"use client";

import React from "react";
import Link from "next/link";
import { AppShell } from "../../components/layout/AppShell";
import { ScoreGauge } from "../../components/ui/ScoreGauge";
import { mockProjectAnalyses } from "../../services/mockData";
import { FolderGit2, ArrowRight, CheckCircle2, AlertTriangle, Sparkles } from "lucide-react";

export default function ProjectsPage() {
  const projects = mockProjectAnalyses;

  return (
    <AppShell>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-sky-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-sky-700 uppercase tracking-wider bg-sky-100 px-2.5 py-0.5 rounded-full border border-sky-200">
                Portfolio Rigor & STAR Analysis
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Candidate Projects Deep-Dive
            </h1>
          </div>

          <Link
            href="/improvements"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-500 hover:to-blue-500 shadow-md shadow-sky-600/25 transition-all"
          >
            <span>Rewrite Project Bullets</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="rounded-3xl glass-panel p-6 sm:p-7 border border-sky-100/90 flex flex-col justify-between space-y-6 shadow-sm hover:border-sky-300 hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <span className="text-[10px] text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-md uppercase font-bold tracking-wider inline-block mb-1.5">
                      Verified Portfolio Item
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">{proj.title}</h3>
                  </div>
                  <ScoreGauge score={proj.overallScore} size={68} strokeWidth={7} label="STAR" />
                </div>

                {/* Sub-Score Bars */}
                <div className="grid grid-cols-3 gap-2 py-3 border-y border-sky-100 text-center bg-white/60 rounded-2xl">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Complexity</span>
                    <span className="text-xs sm:text-sm font-extrabold text-slate-800">{proj.technicalComplexityScore}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">ML/AI Depth</span>
                    <span className="text-xs sm:text-sm font-extrabold text-sky-600">{proj.mlAiDepthScore}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Deployment</span>
                    <span className={`text-xs sm:text-sm font-extrabold ${proj.deploymentScore < 40 ? "text-rose-600" : "text-amber-600"}`}>
                      {proj.deploymentScore}%
                    </span>
                  </div>
                </div>

                {/* STAR Result Notice */}
                <div className="mt-4 rounded-2xl bg-sky-50/70 border border-sky-200 p-3.5 text-xs space-y-1">
                  <div className="text-[10px] font-bold text-sky-800 uppercase tracking-wider">
                    STAR Result Evaluation
                  </div>
                  <p className="text-slate-700 italic font-medium">"{proj.starBreakdown.result}"</p>
                </div>

                {/* Top Recruiter Question */}
                <div className="mt-3.5 text-xs text-slate-600">
                  <span className="text-[11px] font-bold text-slate-800 block mb-1">
                    Recruiter Probing Question:
                  </span>
                  <p className="italic font-normal">"{proj.recruiterQuestions[0]}"</p>
                </div>
              </div>

              <Link
                href={`/projects/${proj.projectId}`}
                className="pt-3.5 border-t border-sky-100 flex items-center justify-between text-xs font-bold text-sky-600 hover:text-sky-700 transition-colors"
              >
                <span>Full STAR Breakdown & Questions</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
