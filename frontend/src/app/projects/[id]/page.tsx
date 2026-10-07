"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AppShell } from "../../../components/layout/AppShell";
import { ScoreGauge } from "../../../components/ui/ScoreGauge";
import { mockProjectAnalyses } from "../../../services/mockData";
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  TrendingUp,
  Sparkles,
} from "lucide-react";

export default function ProjectDetailPage() {
  const params = useParams();
  const projId = (params?.id as string) || "proj-1";

  const project =
    mockProjectAnalyses.find((p) => p.projectId === projId || p.id === projId) ||
    mockProjectAnalyses[0];

  return (
    <AppShell>
      <div className="space-y-6 animate-fade-in">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:text-sky-800 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to All Projects</span>
        </Link>

        {/* Hero Card */}
        <div className="rounded-3xl glass-panel p-6 sm:p-7 border border-sky-100/90 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
          <div>
            <span className="text-xs font-bold text-sky-700 uppercase tracking-wider bg-sky-100 px-2.5 py-0.5 rounded-full border border-sky-200 inline-block mb-1.5">
              Project STAR Deep-Dive
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{project.title}</h1>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Assessed strictly against verified resume text under the Zero-Fabrication protocol.
            </p>
          </div>
          <ScoreGauge score={project.overallScore} size={92} strokeWidth={8} label="STAR Fit" />
        </div>

        {/* STAR 4-Step Breakdown */}
        <div className="rounded-3xl glass-panel p-6 sm:p-7 border border-sky-100/90 space-y-4 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            STAR Framework Alignment
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-sky-100 bg-white/90 p-4 space-y-1.5 shadow-2xs">
              <span className="text-[10px] font-bold text-sky-700 uppercase tracking-wider">
                Situation (Context)
              </span>
              <p className="text-xs text-slate-700 leading-relaxed font-normal">{project.starBreakdown.situation}</p>
            </div>

            <div className="rounded-2xl border border-sky-100 bg-white/90 p-4 space-y-1.5 shadow-2xs">
              <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">
                Task (Objective)
              </span>
              <p className="text-xs text-slate-700 leading-relaxed font-normal">{project.starBreakdown.task}</p>
            </div>

            <div className="rounded-2xl border border-sky-100 bg-white/90 p-4 space-y-1.5 shadow-2xs">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                Action (Implementation)
              </span>
              <p className="text-xs text-slate-700 leading-relaxed font-normal">{project.starBreakdown.action}</p>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 space-y-1.5 shadow-2xs">
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                Result (Measurable Outcome)
              </span>
              <p className="text-xs text-slate-700 leading-relaxed italic font-medium">
                "{project.starBreakdown.result}"
              </p>
            </div>
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-emerald-200 bg-white/90 p-6 space-y-3.5 shadow-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600" />
              <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                Technical Strengths
              </h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-700 font-medium">
              {project.strengths.map((str, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-rose-200 bg-white/90 p-6 space-y-3.5 shadow-sm">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4.5 w-4.5 text-rose-600" />
              <h3 className="text-xs font-bold text-rose-800 uppercase tracking-wider">
                Missing Proof & Weaknesses
              </h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-700 font-medium">
              {project.weaknesses.map((weak, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                  <span>{weak}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recruiter Probing Questions */}
        <div className="rounded-3xl glass-panel p-6 sm:p-7 border border-sky-100/90 space-y-3 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="h-4.5 w-4.5 text-sky-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Recruiter Behavioral & Technical Probes
            </h3>
          </div>
          <div className="space-y-2.5">
            {project.recruiterQuestions.map((q, i) => (
              <div
                key={i}
                className="rounded-2xl border border-sky-100 bg-white/95 p-4 text-xs font-medium text-slate-800 shadow-2xs"
              >
                <span className="text-[10px] font-bold text-sky-700 block mb-1">Question {i + 1}</span>
                <p className="italic">"{q}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
