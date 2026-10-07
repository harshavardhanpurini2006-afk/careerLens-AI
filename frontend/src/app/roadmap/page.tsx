"use client";

import React from "react";
import Link from "next/link";
import { AppShell } from "../../components/layout/AppShell";
import { mockCareerRoadmap } from "../../services/mockData";
import {
  Compass,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  FolderGit2,
  MessagesSquare,
} from "lucide-react";

export default function RoadmapPage() {
  const roadmap = mockCareerRoadmap;

  return (
    <AppShell>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-sky-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-sky-700 uppercase tracking-wider bg-sky-100 px-2.5 py-0.5 rounded-full border border-sky-200">
                12-Week Targeted Pathway
              </span>
              <span className="text-[10px] bg-sky-50 text-sky-800 border border-sky-200 px-2.5 py-0.5 rounded-full font-bold">
                Target: {roadmap.targetRole}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Personalized Upskilling Roadmap
            </h1>
          </div>

          <Link
            href="/interview"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-500 hover:to-blue-500 shadow-md shadow-sky-600/25 transition-all"
          >
            <MessagesSquare className="h-4 w-4" />
            <span>Practice Role Interview</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Current State & Immediate Priorities */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 rounded-3xl glass-panel p-6 sm:p-7 border border-sky-100/90 space-y-3 shadow-sm">
            <div className="flex items-center gap-2">
              <Compass className="h-4.5 w-4.5 text-sky-600" />
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Current State Assessment
              </h2>
            </div>
            <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-normal">
              {roadmap.currentStateSummary}
            </p>
          </div>

          <div className="rounded-3xl border border-sky-200 bg-sky-50/80 p-6 sm:p-7 space-y-3 shadow-sm">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5 text-sky-600" />
              <h3 className="text-xs font-bold text-sky-900 uppercase tracking-wider">
                Immediate 14-Day Focus
              </h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-700 font-medium">
              {roadmap.immediatePriorities.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="h-2 w-2 rounded-full bg-sky-500 shrink-0 mt-1" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Milestone Timeline */}
        <div className="space-y-6 pt-2">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Milestone Progression (Weeks 1 to 12)
          </h2>

          <div className="space-y-6 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-sky-200">
            {roadmap.milestones.map((ms) => {
              const isInProgress = ms.status === "in_progress";

              return (
                <div key={ms.id} className="relative flex items-start gap-6 group">
                  {/* Timeline icon node */}
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 z-10 border-2 transition-transform ${
                      isInProgress
                        ? "bg-gradient-to-r from-sky-600 to-blue-600 border-sky-300 text-white shadow-md shadow-sky-600/30 scale-110"
                        : "bg-white border-sky-200 text-sky-600"
                    }`}
                  >
                    {isInProgress ? <Clock className="h-5 w-5 animate-pulse" /> : <Layers className="h-4 w-4" />}
                  </div>

                  {/* Card Content */}
                  <div className="flex-1 rounded-3xl glass-panel p-6 sm:p-7 border border-sky-100/90 space-y-4 shadow-sm hover:border-sky-300 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded uppercase tracking-wider">
                            Phase {ms.phaseNumber} • {ms.phaseTitle}
                          </span>
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-bold">
                            {ms.duration}
                          </span>
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900">{ms.title}</h3>
                      </div>

                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full border self-start sm:self-auto ${
                          isInProgress
                            ? "bg-sky-100 text-sky-800 border-sky-300 shadow-2xs"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        {isInProgress ? "Active Focus" : "Upcoming Milestone"}
                      </span>
                    </div>

                    <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-normal">{ms.reason}</p>

                    {/* Skills pills */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {ms.skills.map((s, i) => (
                        <span
                          key={i}
                          className="text-[10px] bg-sky-50 border border-sky-200 text-sky-800 font-bold px-2.5 py-0.5 rounded-full shadow-2xs"
                        >
                          {s}
                        </span>
                      ))}
                    </div>

                    {/* Action Items */}
                    <div className="pt-3 border-t border-sky-100 space-y-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        Action Checklist
                      </span>
                      <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
                        {ms.actionItems.map((act, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                            <span>{act}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Recommended Project if applicable */}
                    {ms.recommendedProject && (
                      <div className="rounded-2xl border border-sky-200 bg-white p-4 space-y-1.5 shadow-2xs">
                        <div className="flex items-center gap-2 text-sky-700 text-xs font-bold">
                          <FolderGit2 className="h-4 w-4" />
                          <span>Portfolio Project: {ms.recommendedProject.name}</span>
                        </div>
                        <p className="text-xs text-slate-600 font-normal">{ms.recommendedProject.description}</p>
                        <span className="text-[11px] text-slate-500 font-medium block">
                          Stack: {ms.recommendedProject.architecture}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
