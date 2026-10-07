import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatScore(score: number): string {
  return `${Math.round(score)}%`;
}

export function getScoreColor(score: number): {
  text: string;
  bg: string;
  border: string;
  ring: string;
} {
  if (score >= 80) {
    return {
      text: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      ring: "stroke-emerald-400",
    };
  }
  if (score >= 60) {
    return {
      text: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      ring: "stroke-amber-400",
    };
  }
  return {
    text: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    ring: "stroke-rose-400",
  };
}
