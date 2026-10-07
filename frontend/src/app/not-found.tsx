import React from "react";
import Link from "next/link";
import { Compass, Home, UploadCloud } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f0f7ff] flex flex-col items-center justify-center p-6 text-center text-slate-900">
      <div className="h-16 w-16 rounded-3xl bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-700 mb-4 shadow-sm">
        <Compass className="h-8 w-8" />
      </div>
      <span className="text-xs font-bold text-sky-700 uppercase tracking-wider mb-1 bg-sky-100 px-3 py-1 rounded-full border border-sky-200">
        404 — Page Not Found
      </span>
      <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-2 mb-2">
        Lost in Career Space?
      </h2>
      <p className="text-sm text-slate-600 max-w-md mb-6 leading-relaxed font-medium">
        The requested path does not exist. Check the URL or return to your resume intelligence dashboard.
      </p>
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-500 hover:to-blue-500 shadow-md shadow-sky-600/25 transition-all"
        >
          <Home className="h-4 w-4" />
          <span>Dashboard</span>
        </Link>
        <Link
          href="/upload"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-white border border-sky-200 text-sky-700 hover:bg-sky-50 shadow-xs transition-colors"
        >
          <UploadCloud className="h-4 w-4" />
          <span>Upload Resume</span>
        </Link>
      </div>
    </div>
  );
}
