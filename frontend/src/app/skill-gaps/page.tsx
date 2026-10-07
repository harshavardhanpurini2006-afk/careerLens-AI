"use client";

import React, { useState } from "react";
import { AppShell } from "../../components/layout/AppShell";
import { SkillBadge } from "../../components/ui/SkillBadge";
import { mockSkillGaps } from "../../services/mockData";
import { Layers, ArrowRight, ShieldCheck, CheckCircle2, AlertTriangle, AlertCircle, Filter } from "lucide-react";
import Link from "next/link";

export default function SkillGapsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  const data = mockSkillGaps;

  const filteredItems = data.items.filter((item) => {
    if (selectedCategory !== "All" && item.category !== selectedCategory) return false;
    if (selectedStatus !== "All" && item.currentStatus !== selectedStatus) return false;
    return true;
  });

  return (
    <AppShell>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-sky-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-sky-700 uppercase tracking-wider bg-sky-100 px-2 py-0.5 rounded-full border border-sky-200">
                10-Category Diagnostic Matrix
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Skill Gap & Evidence Analysis
            </h1>
          </div>

          <Link
            href="/roadmap"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-500 hover:to-blue-500 shadow-md shadow-sky-600/25 transition-all"
          >
            <span>Close Gaps with Roadmap</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Metric Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="rounded-2xl border border-emerald-200 bg-white/90 p-4.5 shadow-xs">
            <div className="flex items-center justify-between text-emerald-700 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider">Strong</span>
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{data.strongCount}</div>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">Verified evidence in resume</p>
          </div>

          <div className="rounded-2xl border border-sky-200 bg-white/90 p-4.5 shadow-xs">
            <div className="flex items-center justify-between text-sky-700 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider">Intermediate</span>
              <Layers className="h-4 w-4" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{data.intermediateCount}</div>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">Basic project usage</p>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-white/90 p-4.5 shadow-xs">
            <div className="flex items-center justify-between text-amber-700 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider">Needs Work</span>
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{data.needsImprovementCount}</div>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">Theoretical exposure only</p>
          </div>

          <div className="rounded-2xl border border-rose-200 bg-white/90 p-4.5 shadow-xs">
            <div className="flex items-center justify-between text-rose-700 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider">Missing</span>
              <AlertCircle className="h-4 w-4" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{data.missingCount}</div>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">Zero evidence found</p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white/80 p-3.5 rounded-2xl border border-sky-100 shadow-xs backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <Filter className="h-4 w-4 text-sky-600" />
            <span className="text-xs text-slate-600 font-bold">Filter Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white border border-sky-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-medium shadow-2xs focus:outline-none focus:border-sky-500"
            >
              <option value="All">All Categories ({data.categories.length})</option>
              {data.categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-xs text-slate-600 font-bold">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-white border border-sky-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-medium shadow-2xs focus:outline-none focus:border-sky-500"
            >
              <option value="All">All Statuses</option>
              <option value="Strong">Strong</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Needs Improvement">Needs Improvement</option>
              <option value="Missing">Missing</option>
            </select>
          </div>
        </div>

        {/* Skill Gap Table / List */}
        <div className="rounded-3xl border border-sky-100 bg-white/95 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-sky-50/70 border-b border-sky-100 text-[11px] uppercase tracking-wider text-slate-600 font-bold">
                <tr>
                  <th className="py-3.5 px-4">Skill & Category</th>
                  <th className="py-3.5 px-4">Current Status</th>
                  <th className="py-3.5 px-4">Requirement</th>
                  <th className="py-3.5 px-4">Importance</th>
                  <th className="py-3.5 px-4">Evidence in Resume</th>
                  <th className="py-3.5 px-4">Recommended Next Step</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-100/70">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-sky-50/40 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900 text-sm">{item.skill}</div>
                      <div className="text-[11px] text-slate-500 font-medium">{item.category}</div>
                    </td>
                    <td className="py-4 px-4">
                      <SkillBadge name={item.currentStatus} status={item.currentStatus} />
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-700">
                      {item.roleRequirement}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          item.importance === "Critical"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : item.importance === "High"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        {item.importance}
                      </span>
                    </td>
                    <td className="py-4 px-4 max-w-xs">
                      <div className="text-slate-700 italic truncate font-normal" title={item.evidence}>
                        "{item.evidence}"
                      </div>
                      {item.sourceSection && (
                        <div className="text-[10px] text-sky-700 font-semibold mt-0.5">
                          Section: {item.sourceSection}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 text-slate-700 max-w-sm font-normal leading-relaxed">
                      {item.recommendedAction}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
