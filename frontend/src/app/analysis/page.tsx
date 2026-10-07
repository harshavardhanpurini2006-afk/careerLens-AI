"use client";

import React from "react";
import Link from "next/link";
import { AppShell } from "../../components/layout/AppShell";
import { SkillBadge } from "../../components/ui/SkillBadge";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { useCareerLens } from "../../context/CareerLensContext";
import {
  Briefcase,
  GraduationCap,
  Layers,
  HelpCircle,
  AlertCircle,
  ArrowRight,
  Target,
  UserCheck,
} from "lucide-react";

export default function AnalysisPage() {
  const { candidateProfile, recruiterAnalysis } = useCareerLens();

  const profile = candidateProfile;
  const analysis = recruiterAnalysis;

  return (
    <AppShell>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-sky-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-sky-700 uppercase tracking-wider bg-sky-100 px-2.5 py-0.5 rounded-full border border-sky-200">
                Recruiter Evidence Lens
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Structured Candidate Profile
            </h1>
          </div>

          <Link
            href="/roles/ai_engineer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-500 hover:to-blue-500 shadow-md shadow-sky-600/25 transition-all"
          >
            <Target className="h-4 w-4" />
            <span>View AI Engineer Match (84%)</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Executive Summary */}
        <div className="rounded-3xl glass-panel p-6 border border-sky-100/90 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-2.5 w-2.5 rounded-full bg-sky-600" />
            <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              Profile Summary & Objective
            </h2>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed font-normal">
            {profile?.executiveSummary}
          </p>
        </div>

        {/* Verified Skills Cloud */}
        <div className="rounded-3xl glass-panel p-6 border border-sky-100/90 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-sky-600" />
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                Extracted Skills Taxonomy
              </h2>
            </div>
            <span className="text-xs text-sky-700 font-semibold bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200">
              Zero-Fabrication Guarantee: Extracted directly from resume evidence
            </span>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {profile?.skills.map((skill, index) => (
              <SkillBadge
                key={index}
                name={skill.name}
                status={skill.confidence}
                category={skill.category}
                showCategory={true}
              />
            ))}
          </div>
        </div>

        {/* Experience & Education */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Work Experience */}
          <div className="rounded-3xl glass-panel p-6 border border-sky-100/90 shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="h-4 w-4 text-sky-600" />
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                Experience Timeline
              </h2>
            </div>

            {profile?.workExperience.map((exp, i) => (
              <div key={i} className="rounded-2xl border border-sky-100 bg-white/90 p-4 space-y-2 shadow-2xs">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{exp.title}</h3>
                    <p className="text-xs text-slate-600 font-medium">{exp.company} • {exp.location}</p>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{exp.duration}</span>
                </div>

                <ul className="space-y-1.5 pt-2">
                  {exp.bullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="text-xs text-slate-700 leading-relaxed list-disc list-inside font-normal">
                      {bullet}
                    </li>
                  ))}
                </ul>

                <div className="pt-2 flex flex-wrap gap-1.5">
                  {exp.technologies.map((tech, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[10px] text-sky-800 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-full font-semibold"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Education & Missing Information */}
          <div className="space-y-6">
            <div className="rounded-3xl glass-panel p-6 border border-sky-100/90 shadow-sm space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="h-4 w-4 text-emerald-600" />
                <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                  Education & Credentials
                </h2>
              </div>

              {profile?.education.map((edu, i) => (
                <div key={i} className="rounded-2xl border border-sky-100 bg-white/90 p-4 space-y-2 shadow-2xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{edu.degree}</h3>
                      <p className="text-xs text-slate-600 font-medium">{edu.institution}</p>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      {edu.startYear} – {edu.endYear}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 pt-2 text-xs">
                    <span className="text-slate-600 font-medium">GPA / Honors:</span>
                    <span className="text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full text-[11px] font-bold">
                      {edu.gpa}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Explicit Missing Information Transparency */}
            <div className="rounded-3xl border border-rose-200 bg-rose-50/70 p-6 space-y-3 shadow-xs">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-rose-600" />
                <h3 className="text-xs font-extrabold text-rose-900 uppercase tracking-wider">
                  Absence Transparency (Not Found in Resume)
                </h3>
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                {analysis?.missingInformation.map((info, i) => (
                  <li key={i} className="flex items-center gap-2 font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0" />
                    <span>{info}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Recruiter Probing Questions */}
        <div className="rounded-3xl glass-panel p-6 border border-sky-100/90 shadow-sm space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="h-4 w-4 text-sky-600" />
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              Anticipated Recruiter Interview Questions
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {analysis?.recruiterQuestions.map((q, i) => (
              <div
                key={i}
                className="rounded-2xl border border-sky-100 bg-white/90 p-4 text-xs text-slate-700 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-shadow"
              >
                <p className="leading-relaxed mb-3 italic font-medium">"{q}"</p>
                <Link
                  href="/interview"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-700 hover:text-sky-900"
                >
                  <span>Practice this in Simulator</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
