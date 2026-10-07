"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UploadCloud,
  FileText,
  Target,
  Layers,
  ShieldCheck,
  GitCompare,
  FolderGit2,
  Sparkles,
  Compass,
  MessagesSquare,
  Bot,
  History,
  Settings,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { API_BASE_URL } from "../../services/api";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/upload", label: "Resume Upload", icon: UploadCloud },
  { href: "/analysis", label: "Candidate Profile", icon: FileText },
  { href: "/roles", label: "Role Matches", icon: Target },
  { href: "/skill-gaps", label: "Skill Gaps", icon: Layers },
  { href: "/ats", label: "ATS Scanner", icon: ShieldCheck },
  { href: "/jd-matcher", label: "JD Matcher", icon: GitCompare },
  { href: "/projects", label: "Project STAR", icon: FolderGit2 },
  { href: "/improvements", label: "Resume Improver", icon: Sparkles },
  { href: "/roadmap", label: "Career Roadmap", icon: Compass },
  { href: "/interview", label: "Interview Simulator", icon: MessagesSquare },
  { href: "/copilot", label: "Career AI Copilot", icon: Bot },
  { href: "/history", label: "Version History", icon: History },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [backendLive, setBackendLive] = useState<boolean | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/health`)
      .then((res) => (res.ok ? setBackendLive(true) : setBackendLive(false)))
      .catch(() => setBackendLive(false));
  }, []);

  return (
    <aside className="w-64 shrink-0 glass-sidebar flex flex-col h-screen sticky top-0 transition-all z-20">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-sky-100/80 bg-white/40">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-sky-500/25 group-hover:scale-105 transition-transform">
            <Sparkles className="h-4.5 w-4.5 text-white" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-slate-900 flex items-center gap-1.5">
              CareerLens <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-sky-100 text-sky-700 border border-sky-300">AI</span>
            </span>
            <p className="text-[10px] text-slate-500 font-medium">Gemini Career Intelligence</p>
          </div>
        </Link>
      </div>

      {/* Nav items */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold text-sky-900/60 uppercase tracking-wider flex items-center justify-between">
          <span>Intelligence Modules</span>
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all group",
                isActive
                  ? "bg-sky-500/10 text-sky-900 font-semibold border border-sky-200/90 shadow-xs backdrop-blur-md"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60 hover:border-transparent"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-colors",
                  isActive ? "text-sky-600" : "text-slate-400 group-hover:text-sky-500"
                )}
              />
              <span className="truncate">{item.label}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.8)]" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Bottom Profile & Backend Status */}
      <div className="p-4 border-t border-sky-100/80 bg-white/40 space-y-2.5">
        <div className="rounded-xl border border-sky-200/60 bg-white/80 p-3 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-slate-700">Active Profile</span>
            <span className="text-[10px] font-semibold text-sky-700 bg-sky-100/80 px-2 py-0.5 rounded-full border border-sky-200">
              Analyzed
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-900 truncate">Alex Rivera</p>
          <p className="text-[11px] text-sky-600 font-medium">Top Match: AI Engineer (84%)</p>
        </div>

        {/* Engine status indicator */}
        <div className="flex items-center justify-between px-2 text-[10px] text-slate-500 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Gemini 3.5 Engine
          </span>
          <span className="text-emerald-700 font-semibold">
            {backendLive === null ? "Connecting..." : backendLive ? "Live API" : "Ready"}
          </span>
        </div>
      </div>
    </aside>
  );
}
