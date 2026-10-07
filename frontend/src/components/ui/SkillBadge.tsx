"use client";

import React from "react";
import { cn } from "../../lib/utils";
import { SkillStatus } from "../../types";

interface SkillBadgeProps {
  name: string;
  status?: SkillStatus | "FOUND" | "INFERRED" | "NOT_FOUND";
  category?: string;
  evidenceSnippet?: string;
  className?: string;
  showCategory?: boolean;
}

export function SkillBadge({
  name,
  status = "Strong",
  category,
  className,
  showCategory = false,
}: SkillBadgeProps) {
  const statusStyles: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    Strong: {
      bg: "bg-emerald-50 border-emerald-200",
      text: "text-emerald-800 font-semibold",
      dot: "bg-emerald-500",
      label: "Strong",
    },
    FOUND: {
      bg: "bg-emerald-50 border-emerald-200",
      text: "text-emerald-800 font-semibold",
      dot: "bg-emerald-500",
      label: "Verified",
    },
    Intermediate: {
      bg: "bg-sky-50 border-sky-200",
      text: "text-sky-800 font-semibold",
      dot: "bg-sky-500",
      label: "Intermediate",
    },
    INFERRED: {
      bg: "bg-amber-50 border-amber-200",
      text: "text-amber-800 font-semibold",
      dot: "bg-amber-500",
      label: "Inferred",
    },
    "Needs Improvement": {
      bg: "bg-amber-50 border-amber-200",
      text: "text-amber-800 font-semibold",
      dot: "bg-amber-500",
      label: "Needs Improvement",
    },
    Missing: {
      bg: "bg-rose-50 border-rose-200",
      text: "text-rose-800 font-semibold",
      dot: "bg-rose-500",
      label: "Missing in Resume",
    },
    NOT_FOUND: {
      bg: "bg-slate-100 border-slate-200",
      text: "text-slate-600 font-semibold",
      dot: "bg-slate-400",
      label: "Not Found",
    },
  };

  const style = statusStyles[status] || statusStyles.Strong;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs transition-colors shadow-2xs",
        style.bg,
        style.text,
        className
      )}
      title={`${name} (${style.label})`}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", style.dot)} aria-hidden="true" />
      <span>{name}</span>
      {showCategory && category && (
        <span className="text-[10px] text-slate-500 font-normal">({category})</span>
      )}
      <span className="sr-only">Status: {style.label}</span>
    </span>
  );
}
