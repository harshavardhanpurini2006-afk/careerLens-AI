"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppShell } from "../../components/layout/AppShell";
import { mockHistoryRecords } from "../../services/mockData";
import { historyService } from "../../services/historyService";
import { History, FileText, ArrowRight, Trash2, GitCompare, CheckCircle2 } from "lucide-react";

export default function HistoryPage() {
  const [records, setRecords] = useState(mockHistoryRecords);

  const handleDelete = async (id: string) => {
    const res = await historyService.deleteRecord(id);
    if (res.success) {
      setRecords((prev) => prev.filter((r) => r.id !== id));
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
                Resume Evolution Audit
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Analysis Version History
            </h1>
          </div>

          <Link
            href="/upload"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-500 hover:to-blue-500 shadow-md shadow-sky-600/25 transition-all"
          >
            <span>Upload New Version</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* History List */}
        <div className="space-y-4">
          {records.map((rec) => (
            <div
              key={rec.id}
              className="rounded-3xl glass-panel p-6 border border-sky-100/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-sm font-extrabold text-slate-900">{rec.resumeVersion}</span>
                  <span className="text-xs text-slate-500 font-medium">• {rec.date}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                  <FileText className="h-4 w-4 text-sky-600" />
                  <span className="font-semibold">{rec.filename}</span>
                </div>
                <p className="text-xs text-slate-600 italic">"{rec.changeSummary}"</p>
              </div>

              {/* Metrics */}
              <div className="flex items-center gap-4 sm:gap-6 border-y md:border-y-0 md:border-x border-sky-100 py-3 md:py-0 md:px-6">
                <div className="text-center">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">
                    Resume
                  </span>
                  <span className="text-lg font-extrabold text-emerald-600">{rec.resumeScore}%</span>
                </div>
                <div className="text-center">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">
                    ATS Score
                  </span>
                  <span className="text-lg font-extrabold text-amber-600">{rec.atsScore}%</span>
                </div>
                <div className="text-center">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">
                    Top Role
                  </span>
                  <span className="text-sm font-extrabold text-slate-900">{rec.topRole}</span>
                  <span className="text-[10px] text-sky-600 block font-bold">
                    {rec.roleMatch}% Fit
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5">
                <Link
                  href="/dashboard"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-white text-sky-700 border border-sky-200 hover:bg-sky-50 shadow-xs transition-colors"
                >
                  View Analysis
                </Link>
                <button
                  onClick={() => handleDelete(rec.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                  title="Delete Record"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
