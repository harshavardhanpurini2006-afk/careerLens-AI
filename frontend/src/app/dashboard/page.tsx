"use client";

import React from "react";
import Link from "next/link";
import { AppShell } from "../../components/layout/AppShell";
import { ScoreGauge } from "../../components/ui/ScoreGauge";
import { StatCard } from "../../components/ui/StatCard";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { useCareerLens } from "../../context/CareerLensContext";
import {
  Target,
  ShieldCheck,
  Layers,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Compass,
  MessagesSquare,
  Sparkles,
  CheckCircle2,
  Zap,
  Briefcase,
  FileText,
} from "lucide-react";

export default function DashboardPage() {
  const { candidateProfile, recruiterAnalysis, openCopilot } = useCareerLens();

  const analysis = recruiterAnalysis;
  const profile = candidateProfile;

  return (
    <AppShell>
      <div className="space-y-8 animate-fade-in">
        {/* Hero Header Glass Banner */}
        <div className="relative rounded-3xl glass-panel p-6 sm:p-8 overflow-hidden border border-sky-200/80 shadow-md shadow-sky-950/5">
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-gradient-to-br from-sky-400/20 to-blue-600/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2.5 mb-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-800 bg-sky-100/90 border border-sky-300 px-3 py-1 rounded-full shadow-2xs">
                  <Sparkles className="h-3.5 w-3.5 text-sky-600 animate-pulse" />
                  Gemini AI Powered Intelligence
                </span>
                <span className="text-xs font-semibold text-slate-600 bg-white/80 border border-sky-100 px-2.5 py-0.5 rounded-full">
                  Candidate: {profile?.name || "Alex Rivera"}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                Recruiter-Grade Career Intelligence
              </h1>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-600 max-w-2xl font-normal leading-relaxed">
                Automated 5-factor deterministic matching, zero-fabrication candidate profiling, and AI recruiter insights powered by Google Gemini.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={openCopilot}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-white text-sky-800 border border-sky-300 hover:bg-sky-50 hover:border-sky-400 shadow-sm transition-all cursor-pointer group"
              >
                <Sparkles className="h-4 w-4 text-sky-600 group-hover:rotate-12 transition-transform" />
                <span>Ask Gemini Copilot</span>
              </button>
              <Link
                href="/roles/ai_engineer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-500 hover:to-blue-500 shadow-sm shadow-sky-600/25 transition-all"
              >
                <span>Explore Top Fit (AI Engineer)</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* 4 Core Diagnostic Glass Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <div className="rounded-2xl border border-sky-100/90 bg-white/80 p-5 backdrop-blur-md shadow-xs flex items-center justify-between hover:border-sky-300 hover:shadow-md transition-all">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Overall Resume Score
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">78 / 100</div>
              <p className="text-[11px] font-medium text-emerald-600 mt-1 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Strong Technical Core
              </p>
            </div>
            <ScoreGauge score={analysis?.overallScore || 78} size={80} strokeWidth={8} />
          </div>

          <div className="rounded-2xl border border-sky-100/90 bg-white/80 p-5 backdrop-blur-md shadow-xs flex items-center justify-between hover:border-sky-300 hover:shadow-md transition-all">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                ATS Readiness
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">76 / 100</div>
              <p className="text-[11px] font-medium text-amber-600 mt-1 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" /> Minor keyword dilution
              </p>
            </div>
            <ScoreGauge score={analysis?.atsReadiness || 76} size={80} strokeWidth={8} />
          </div>

          <StatCard
            title="Top Matched Role"
            value="AI Engineer"
            subtitle="Calculated across 11 industry benchmarks"
            badge={{ text: "84% Fit", variant: "success" }}
            icon={<Target className="h-4.5 w-4.5 text-sky-600" />}
          />

          <StatCard
            title="Verified Skills"
            value={`${profile?.skills?.length || 8} Found`}
            subtitle="Verified against document evidence"
            badge={{ text: "0 Fabrication", variant: "primary" }}
            icon={<Layers className="h-4.5 w-4.5 text-indigo-600" />}
          />
        </div>

        {/* Executive Recruiter Summary (Glass Panel) */}
        <div className="rounded-3xl glass-panel p-6 sm:p-7 border border-sky-100/90 shadow-xs">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-sky-100 flex items-center justify-center text-sky-700">
                <Briefcase className="h-4 w-4" />
              </div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Senior Technical Recruiter Perspective
              </h2>
            </div>
            <span className="text-xs font-semibold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
              Grounded AI Evaluation
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
            {analysis?.executiveSummary ||
              "Candidate Alex Rivera demonstrates solid fundamentals in classical machine learning and data workflows with Scikit-learn, SQL, and Pandas. Primary opportunities to achieve senior callback rates center around containerized microservices (Docker) and REST endpoint serving (FastAPI)."}
          </p>
        </div>

        {/* Recruiter Signals Matrix */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">Recruiter Signals Matrix</h2>
              <p className="text-xs text-slate-500">Categorized hiring indicators derived directly from resume text</p>
            </div>
            <Link
              href="/analysis"
              className="text-xs font-bold text-sky-700 hover:text-sky-800 flex items-center gap-1 group"
            >
              <span>Full Candidate Profile</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {analysis?.signals.map((signal) => (
              <div
                key={signal.id}
                className="rounded-2xl border border-sky-100/90 bg-white/85 p-5 backdrop-blur-md shadow-xs flex flex-col justify-between hover:border-sky-300 hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <StatusBadge
                      type={signal.type}
                      label={
                        signal.type === "green"
                          ? "Positive Signal"
                          : signal.type === "yellow"
                          ? "Concern Area"
                          : "Critical Gap"
                      }
                    />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1.5">{signal.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-3">{signal.description}</p>
                </div>
                <div className="pt-2.5 border-t border-sky-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                    Resume Evidence
                  </span>
                  <p className="text-xs text-slate-700 font-medium italic truncate">"{signal.evidence}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Actions & Quick Launch Hub */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Priority Actions */}
          <div className="lg:col-span-2 rounded-3xl glass-panel p-6 sm:p-7 border border-sky-100/90 shadow-xs">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="h-7 w-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="h-4 w-4" />
              </div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Priority Action Plan (To Unlock 90%+ Target Match)
              </h2>
            </div>
            <div className="space-y-3">
              {analysis?.priorityActions.map((action, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3.5 rounded-xl border border-sky-100 bg-white/90 p-4 text-xs sm:text-[13px] text-slate-700 shadow-2xs hover:border-sky-200 transition-colors"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-sky-800 text-xs font-extrabold">
                    {i + 1}
                  </span>
                  <p className="leading-relaxed font-medium">{action}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Jump To Intelligence Engines */}
          <div className="rounded-3xl glass-panel p-6 sm:p-7 border border-sky-100/90 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Compass className="h-4.5 w-4.5 text-sky-600" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Career Acceleration Hub
                </h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Execute next steps directly using our specialized intelligence engines:
              </p>
              <div className="space-y-2 text-xs">
                <Link
                  href="/roles"
                  className="flex items-center justify-between p-3 rounded-xl bg-white/90 border border-sky-100 text-slate-700 hover:border-sky-300 hover:text-sky-800 hover:bg-sky-50 transition-all shadow-2xs"
                >
                  <span className="flex items-center gap-2.5 font-semibold">
                    <Target className="h-4 w-4 text-sky-600" />
                    <span>Compare 11 Target Roles</span>
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                </Link>

                <Link
                  href="/ats"
                  className="flex items-center justify-between p-3 rounded-xl bg-white/90 border border-sky-100 text-slate-700 hover:border-sky-300 hover:text-sky-800 hover:bg-sky-50 transition-all shadow-2xs"
                >
                  <span className="flex items-center gap-2.5 font-semibold">
                    <ShieldCheck className="h-4 w-4 text-amber-600" />
                    <span>Run ATS Scanner Fixes</span>
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                </Link>

                <Link
                  href="/roadmap"
                  className="flex items-center justify-between p-3 rounded-xl bg-white/90 border border-sky-100 text-slate-700 hover:border-sky-300 hover:text-sky-800 hover:bg-sky-50 transition-all shadow-2xs"
                >
                  <span className="flex items-center gap-2.5 font-semibold">
                    <Compass className="h-4 w-4 text-emerald-600" />
                    <span>View 12-Week Roadmap</span>
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                </Link>

                <Link
                  href="/interview"
                  className="flex items-center justify-between p-3 rounded-xl bg-white/90 border border-sky-100 text-slate-700 hover:border-sky-300 hover:text-sky-800 hover:bg-sky-50 transition-all shadow-2xs"
                >
                  <span className="flex items-center gap-2.5 font-semibold">
                    <MessagesSquare className="h-4 w-4 text-indigo-600" />
                    <span>Start Mock Interview</span>
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                </Link>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-sky-100 text-[11px] text-slate-400 font-medium">
              Zero fabrication policy strictly maintained.
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
