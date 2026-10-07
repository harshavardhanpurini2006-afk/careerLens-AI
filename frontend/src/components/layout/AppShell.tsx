"use client";

import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { CopilotDrawer } from "./CopilotDrawer";
import { X } from "lucide-react";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen text-slate-800 font-sans antialiased selection:bg-sky-500/20 selection:text-sky-900">
      {/* Background radial ambient lights */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-sky-200/50 rounded-full blur-3xl animate-pulse-subtle" />
        <div className="absolute top-1/3 -right-20 w-[500px] h-[500px] bg-blue-100/60 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 w-[600px] h-[600px] bg-indigo-100/40 rounded-full blur-3xl" />
      </div>

      {/* Desktop Frosted Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-sky-950/30 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-72 bg-white/95 backdrop-blur-2xl border-r border-sky-100 flex flex-col h-full shadow-2xl">
            <div className="absolute top-4 right-4 z-20">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-sky-50"
                aria-label="Close navigation"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar onToggleMobileMenu={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* Global Slide-out Glass Copilot Drawer */}
      <CopilotDrawer />
    </div>
  );
}
