"use client";

import React from "react";
import { cn } from "../../lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  badge?: {
    text: string;
    variant?: "success" | "warning" | "danger" | "neutral" | "primary";
  };
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function StatCard({
  title,
  value,
  subtitle,
  badge,
  icon,
  className,
  onClick,
}: StatCardProps) {
  const badgeColors = {
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    danger: "bg-rose-50 text-rose-700 border-rose-200",
    neutral: "bg-slate-100 text-slate-700 border-slate-200",
    primary: "bg-sky-50 text-sky-700 border-sky-200",
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-2xl border border-sky-100/90 bg-white/80 p-5 backdrop-blur-md shadow-xs transition-all duration-200 hover:shadow-md hover:border-sky-300 hover:-translate-y-0.5",
        onClick && "cursor-pointer",
        className
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        {icon && (
          <div className="h-8 w-8 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 shadow-2xs">
            {icon}
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-2.5">
        <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          {value}
        </span>
        {badge && (
          <span
            className={cn(
              "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold",
              badgeColors[badge.variant || "neutral"]
            )}
          >
            {badge.text}
          </span>
        )}
      </div>
      {subtitle && (
        <p className="mt-2 text-xs text-slate-500 leading-relaxed font-normal">{subtitle}</p>
      )}
    </div>
  );
}
