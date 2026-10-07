"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AppShell } from "../../../components/layout/AppShell";
import { ScoreGauge } from "../../../components/ui/ScoreGauge";
import { RadarScoreChart } from "../../../components/ui/RadarScoreChart";
import { mockRoleFits, mockJobRoles } from "../../../services/mockData";
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Compass,
  MessagesSquare,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

export default function RoleDetailPage() {
  const params = useParams();
  const roleSlug = (params?.role as string) || "ai_engineer";

  const roleFit =
    mockRoleFits.find((r) => r.roleCode === roleSlug) || mockRoleFits[0];
  const roleMeta =
    mockJobRoles.find((r) => r.roleCode === roleSlug) || mockJobRoles[0];

  return (
    <AppShell>
      <div className="space-y-6 animate-fade-in">
        {/* Back Link */}
        <Link
          href="/roles"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:text-sky-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to All 11 Roles</span>
        </Link>

        {/* Hero Header */}
        <div className="rounded-3xl glass-panel p-6 sm:p-7 border border-sky-100/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-sky-700 uppercase tracking-wider bg-sky-100 px-2.5 py-0.5 rounded-full border border-sky-200">
                {roleFit.category} Specialization
              </span>
              <span className="text-[10px] font-bold bg-white text-slate-700 border border-sky-200 px-2 py-0.5 rounded-full">
                Deterministic Fit Score
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {roleFit.roleName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mt-2 leading-relaxed font-medium">
              {roleMeta.description}
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <ScoreGauge
              score={roleFit.deterministicScore}
              size={90}
              strokeWidth={8}
              label="Role Fit"
            />
          </div>
        </div>

        {/* 5-Factor Score Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
          {[
            { label: "Required Skills (50%)", val: `${roleFit.requiredSkillCoverage}%` },
            { label: "Preferred Skills (20%)", val: `${roleFit.preferredSkillCoverage}%` },
            { label: "Project Depth (10%)", val: `${roleFit.projectRelevanceScore}%` },
            { label: "Experience (10%)", val: `${roleFit.experienceRelevanceScore}%` },
            { label: "Domain Keywords (10%)", val: `${roleFit.keywordScore}%` },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-sky-100 bg-white/90 p-3.5 shadow-2xs"
            >
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">
                {stat.label}
              </div>
              <div className="text-base sm:text-lg font-extrabold text-slate-900">{stat.val}</div>
            </div>
          ))}
        </div>

        {/* Main Grid: Radar Chart + Recruiter Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Radar Chart */}
          <div className="rounded-3xl glass-panel p-6 border border-sky-100/90 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                Candidate Evidence vs Ideal Benchmark
              </h3>
            </div>
            <RadarScoreChart data={roleFit.radarMetrics} height={320} />
          </div>

          {/* Why it matches & Recruiter Concerns */}
          <div className="space-y-6">
            <div className="rounded-3xl glass-panel p-6 border border-sky-100/90 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-sky-600" />
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                  Why This Role Fits You
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                {roleFit.whyItFits}
              </p>
            </div>

            <div className="rounded-3xl border border-rose-200 bg-rose-50/70 p-6 space-y-3 shadow-xs">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-rose-600" />
                <h3 className="text-xs font-extrabold text-rose-900 uppercase tracking-wider">
                  Senior Recruiter Bottlenecks
                </h3>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
                {roleFit.recruiterConcerns.map((c, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0 mt-1" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Matched vs Missing Skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Matched */}
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50/70 p-6 space-y-3 shadow-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <h3 className="text-xs font-extrabold text-emerald-900 uppercase tracking-wider">
                Matched Requirements ({roleFit.matchedSkills.length})
              </h3>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {roleFit.matchedSkills.map((s, i) => (
                <span
                  key={i}
                  className="text-xs bg-white border border-emerald-200 text-emerald-800 font-bold px-2.5 py-1 rounded-full shadow-2xs"
                >
                  ✓ {s}
                </span>
              ))}
            </div>
          </div>

          {/* Missing */}
          <div className="rounded-3xl border border-rose-200 bg-rose-50/70 p-6 space-y-3 shadow-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-rose-600" />
              <h3 className="text-xs font-extrabold text-rose-900 uppercase tracking-wider">
                Identified Skill Gaps ({roleFit.missingSkills.length})
              </h3>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {roleFit.missingSkills.map((g, i) => (
                <span
                  key={i}
                  className="text-xs bg-white border border-rose-200 text-rose-800 font-bold px-2.5 py-1 rounded-full shadow-2xs"
                >
                  ✕ {g} (Not found in resume)
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="rounded-3xl glass-panel p-6 border border-sky-100/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-extrabold text-slate-900">Bridge Gaps for {roleFit.roleName}</h4>
            <p className="text-xs text-slate-600 font-medium">
              Follow our tailored roadmap or practice resume-grounded mock interviews.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/roadmap"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-500 hover:to-blue-500 shadow-md shadow-sky-600/25 transition-all"
            >
              <Compass className="h-4 w-4" />
              <span>Open 12-Week Roadmap</span>
            </Link>
            <Link
              href="/interview"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-white border border-sky-200 text-sky-700 hover:bg-sky-50 shadow-xs transition-all"
            >
              <MessagesSquare className="h-4 w-4" />
              <span>Simulate Interview</span>
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
