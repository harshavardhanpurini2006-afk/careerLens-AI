"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppShell } from "../../components/layout/AppShell";
import { mockRoleFits } from "../../services/mockData";
import { Target, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

export default function RolesPage() {
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"match" | "gap">("match");

  const filteredRoles = mockRoleFits
    .filter((r) => (filterCategory === "All" ? true : r.category === filterCategory))
    .sort((a, b) => {
      if (sortBy === "match") return b.deterministicScore - a.deterministicScore;
      if (sortBy === "gap") return b.missingSkills.length - a.missingSkills.length;
      return 0;
    });

  return (
    <AppShell>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-sky-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-sky-700 uppercase tracking-wider bg-sky-100 px-2.5 py-0.5 rounded-full border border-sky-200">
                Multi-Role Matching Engine
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              11 Supported Target Roles
            </h1>
          </div>

          {/* Filters & Sorting */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center bg-white border border-sky-200 rounded-xl p-1 text-xs shadow-2xs">
              {["All", "AI/ML", "Data", "Software"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    filterCategory === cat
                      ? "bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "match" | "gap")}
              className="bg-white border border-sky-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-medium shadow-2xs focus:outline-none focus:border-sky-500"
            >
              <option value="match">Sort: Best Match %</option>
              <option value="gap">Sort: Most Skill Gaps</option>
            </select>
          </div>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRoles.map((role) => {
            const score = role.deterministicScore;
            let scoreBg = "bg-emerald-50 text-emerald-800 border-emerald-200";
            if (score < 60) scoreBg = "bg-rose-50 text-rose-800 border-rose-200";
            else if (score < 80) scoreBg = "bg-amber-50 text-amber-800 border-amber-200";

            return (
              <div
                key={role.roleCode}
                className="rounded-3xl glass-panel p-6 flex flex-col justify-between border border-sky-100/90 shadow-sm hover:shadow-md transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold text-sky-700 uppercase tracking-wider bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                      {role.category}
                    </span>
                    <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${scoreBg}`}>
                      {score}% Match
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 mb-2 group-hover:text-sky-700 transition-colors">
                    {role.roleName}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-2 font-medium">
                    {role.whyItFits}
                  </p>

                  {/* Matched skills snippet */}
                  <div className="space-y-2 mb-4">
                    <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Top Signals ({role.matchedSkills.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {role.matchedSkills.slice(0, 3).map((s, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-white border border-sky-200 text-slate-800 font-medium px-2 py-0.5 rounded-full shadow-2xs"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Missing skills snippet */}
                  <div className="space-y-2 mb-4">
                    <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                      <AlertCircle className="h-3.5 w-3.5 text-rose-600" />
                      <span>Priority Gaps ({role.missingSkills.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {role.missingSkills.slice(0, 3).map((g, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-rose-50 border border-rose-200 text-rose-800 font-semibold px-2 py-0.5 rounded-full"
                        >
                          {g}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <Link
                  href={`/roles/${role.roleCode}`}
                  className="mt-3 pt-3 border-t border-sky-100 flex items-center justify-between text-xs font-bold text-sky-700 group-hover:text-sky-900 transition-colors"
                >
                  <span>View Radar & Recruiter Notes</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
