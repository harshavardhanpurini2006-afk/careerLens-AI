import React from "react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#f0f7ff] flex flex-col items-center justify-center p-6 text-slate-900">
      <div className="relative flex items-center justify-center mb-4">
        <div className="h-14 w-14 rounded-full border-3 border-sky-200 border-t-sky-600 animate-spin" />
        <div className="absolute h-8 w-8 rounded-full border-3 border-blue-200 border-b-blue-600 animate-spin" />
      </div>
      <h3 className="text-sm font-bold text-slate-900">Loading CareerLens AI...</h3>
      <p className="text-xs text-slate-500 font-medium mt-1">Assembling candidate intelligence metrics</p>
    </div>
  );
}
