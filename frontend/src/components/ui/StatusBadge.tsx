"use client";

import React from "react";
import { cn } from "../../lib/utils";

interface StatusBadgeProps {
  type: "green" | "yellow" | "red" | "neutral" | "info";
  label: string;
  className?: string;
}

export function StatusBadge({ type, label, className }: StatusBadgeProps) {
  const styles = {
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    yellow: "bg-amber-50 text-amber-700 border-amber-200",
    red: "bg-rose-50 text-rose-700 border-rose-200",
    neutral: "bg-slate-100 text-slate-700 border-slate-200",
    info: "bg-sky-50 text-sky-700 border-sky-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        styles[type],
        className
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          type === "green" && "bg-emerald-500",
          type === "yellow" && "bg-amber-500",
          type === "red" && "bg-rose-500",
          type === "neutral" && "bg-slate-400",
          type === "info" && "bg-sky-500"
        )}
      />
      {label}
    </span>
  );
}

interface EvidenceCardProps {
  title: string;
  evidence: string;
  sourceSection?: string;
  type?: "verified" | "missing" | "inferred";
  className?: string;
}

export function EvidenceCard({
  title,
  evidence,
  sourceSection,
  type = "verified",
  className,
}: EvidenceCardProps) {
  const isMissing = type === "missing" || evidence.toLowerCase().includes("not found");

  return (
    <div
      className={cn(
        "rounded-xl border p-3.5 text-sm transition-all",
        isMissing
          ? "border-rose-200 bg-rose-50/70 text-slate-700"
          : "border-sky-100 bg-white/80 text-slate-800 shadow-2xs",
        className
      )}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="font-semibold text-slate-900">{title}</span>
        {sourceSection && (
          <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider">
            {sourceSection}
          </span>
        )}
      </div>
      <p className="text-xs text-slate-500 italic">"{evidence}"</p>
    </div>
  );
}
