"use client";

import React from "react";
import { cn } from "../../lib/utils";

interface ScoreGaugeProps {
  score: number; // 0-100
  size?: number; // default 120
  strokeWidth?: number; // default 10
  label?: string;
  sublabel?: string;
  className?: string;
}

export function ScoreGauge({
  score,
  size = 120,
  strokeWidth = 10,
  label = "Score",
  sublabel,
  className,
}: ScoreGaugeProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  let strokeColor = "stroke-emerald-500";
  let textColor = "text-emerald-600";
  let glowColor = "rgba(16, 185, 129, 0.2)";

  if (score < 60) {
    strokeColor = "stroke-rose-500";
    textColor = "text-rose-600";
    glowColor = "rgba(244, 63, 94, 0.2)";
  } else if (score < 80) {
    strokeColor = "stroke-amber-500";
    textColor = "text-amber-600";
    glowColor = "rgba(245, 158, 11, 0.2)";
  }

  return (
    <div className={cn("relative flex flex-col items-center justify-center", className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-sky-100"
        />
        {/* Fill */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className={cn("transition-all duration-1000 ease-out", strokeColor)}
          style={{ filter: `drop-shadow(0 0 6px ${glowColor})` }}
        />
      </svg>
      {/* Center Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className={cn("text-2xl font-extrabold tracking-tight", textColor)}>
          {Math.round(score)}%
        </span>
        {label && <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>}
      </div>
      {sublabel && <span className="mt-2 text-xs text-slate-500 text-center font-medium">{sublabel}</span>}
    </div>
  );
}
