"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, Home } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("CareerLens UI error caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#f0f7ff] flex flex-col items-center justify-center p-6 text-center text-slate-900">
      <div className="h-16 w-16 rounded-3xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 mb-4 shadow-sm">
        <AlertCircle className="h-8 w-8" />
      </div>
      <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 mb-2">
        Something went wrong
      </h2>
      <p className="text-sm text-slate-600 max-w-md mb-6 leading-relaxed font-medium">
        We encountered an issue rendering this view. You can retry the operation or return to the main dashboard.
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-500 hover:to-blue-500 shadow-md shadow-sky-600/25 transition-all cursor-pointer"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Try Again</span>
        </button>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-white border border-sky-200 text-sky-700 hover:bg-sky-50 shadow-xs transition-colors"
        >
          <Home className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
