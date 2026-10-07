"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Target,
  Layers,
  Compass,
  MessagesSquare,
  Bot,
  FileText,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Zap,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen text-slate-800 flex flex-col selection:bg-sky-500/20 selection:text-sky-900">
      {/* Navigation */}
      <nav className="glass-nav sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-sky-500/25 group-hover:scale-105 transition-transform">
              <Sparkles className="h-4.5 w-4.5 text-white" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-slate-900 flex items-center gap-1.5">
                CareerLens <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-sky-100 text-sky-700 border border-sky-300">AI</span>
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600">
            <a href="#how-it-works" className="hover:text-sky-600 transition-colors">
              How It Works
            </a>
            <a href="#features" className="hover:text-sky-600 transition-colors">
              Modules
            </a>
            <a href="#recruiter-lens" className="hover:text-sky-600 transition-colors">
              Recruiter Intelligence
            </a>
            <a href="#faq" className="hover:text-sky-600 transition-colors">
              FAQ
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-xs font-bold text-slate-700 hover:text-sky-600 px-3.5 py-1.5 rounded-xl transition-colors hidden sm:inline-block bg-white/60 border border-sky-100 hover:bg-white"
            >
              Demo Preview
            </Link>
            <Link
              href="/upload"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-500 hover:to-blue-500 shadow-md shadow-sky-600/25 transition-all"
            >
              <span>Analyze Resume</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden px-6">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-sky-300/80 bg-white/80 backdrop-blur-md text-sky-800 text-xs font-bold mb-6 shadow-xs animate-pulse-subtle">
            <Sparkles className="h-3.5 w-3.5 text-sky-600" />
            <span>Powered by Gemini AI • Recruiter-Grade Evaluation</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12] mb-6">
            Understand your resume. <br />
            <span className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Discover your true career match.
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8 font-normal">
            Upload your resume for senior recruiter-level diagnostics, multi-role fit algorithms, objective skill-gap matrices, ATS readiness scores, and AI Copilot guidance grounded in actual candidate evidence.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              href="/upload"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-bold bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-500 hover:to-blue-500 shadow-lg shadow-sky-600/25 transition-all hover:scale-[1.02]"
            >
              <FileText className="h-4.5 w-4.5" />
              <span>Upload Resume to Analyze</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-bold bg-white/90 border border-sky-200 text-slate-700 hover:text-sky-800 hover:bg-sky-50 transition-all shadow-xs"
            >
              <span>Explore Demo (Alex Rivera)</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Pillars */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left max-w-3xl mx-auto pt-8 border-t border-sky-200/60">
            <div className="glass-panel p-4 rounded-2xl border border-sky-100">
              <div className="text-2xl font-extrabold text-slate-900">Zero</div>
              <p className="text-xs text-slate-500 font-medium">Fact Fabrication</p>
            </div>
            <div className="glass-panel p-4 rounded-2xl border border-sky-100">
              <div className="text-2xl font-extrabold text-sky-600">11 Roles</div>
              <p className="text-xs text-slate-500 font-medium">Multi-Role Benchmarks</p>
            </div>
            <div className="glass-panel p-4 rounded-2xl border border-sky-100">
              <div className="text-2xl font-extrabold text-blue-600">5-Factor</div>
              <p className="text-xs text-slate-500 font-medium">Deterministic Scoring</p>
            </div>
            <div className="glass-panel p-4 rounded-2xl border border-sky-100">
              <div className="text-2xl font-extrabold text-indigo-600">100%</div>
              <p className="text-xs text-slate-500 font-medium">Gemini-Grounded Q&A</p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Preview Card */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto rounded-3xl glass-panel p-6 sm:p-8 border border-sky-200/90 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-sky-100 gap-3">
            <div>
              <span className="text-xs font-bold text-sky-700 uppercase tracking-wider bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                Recruiter Diagnostic Preview
              </span>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
                Target Role: AI Engineer — 84% Match
              </h3>
            </div>
            <span className="text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full shadow-2xs self-start sm:self-auto">
              Strong Technical Fit
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            <div className="rounded-2xl border border-emerald-200 bg-white/90 p-5 shadow-xs">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-2.5">
                Strong Signals (Found in Resume)
              </span>
              <ul className="space-y-2 text-xs text-slate-700 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Python & SQL core data pipelines</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Pandas & NumPy feature manipulation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Scikit-learn supervised ML models</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-rose-200 bg-white/90 p-5 shadow-xs">
              <span className="text-xs font-bold text-rose-700 uppercase tracking-wider block mb-2.5">
                Identified Gaps (Not in Resume)
              </span>
              <ul className="space-y-2 text-xs text-slate-700 font-medium">
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0" />
                  <span>PyTorch deep learning architecture</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0" />
                  <span>Docker model containerization</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0" />
                  <span>FastAPI inference REST endpoints</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-sky-200 bg-white/90 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-sky-800 uppercase tracking-wider block mb-2">
                  Senior Recruiter Verdict
                </span>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  "Candidate shows verified scripting and classical ML fundamentals. Closing the PyTorch and Docker gaps immediately positions this candidate for top quartile interview callbacks."
                </p>
              </div>
              <Link
                href="/roles/ai_engineer"
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-700"
              >
                <span>View Full AI Engineer Diagnostic</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-6 border-t border-sky-100 bg-white/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-sky-700 uppercase tracking-wider bg-sky-100 px-3 py-1 rounded-full border border-sky-200">
              Intelligence Modules
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
              Beyond Basic Scanning — Full Career Acceleration
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Target,
                title: "11 Role Match Matrices",
                description:
                  "Deterministic 5-factor scoring comparing candidate evidence against AI Engineer, ML, Data Science, and MLOps benchmarks.",
                link: "/roles",
              },
              {
                icon: Layers,
                title: "10-Category Skill Gap Analysis",
                description:
                  "Classifies skills into Strong, Intermediate, Needs Improvement, and Missing with concrete evidence quotes.",
                link: "/skill-gaps",
              },
              {
                icon: ShieldCheck,
                title: "ATS Readiness & Before/After Fixes",
                description:
                  "Identifies parseability flags, metric absence, and suggests actionable line-by-line rewrites.",
                link: "/ats",
              },
              {
                icon: TrendingUp,
                title: "Project STAR Deep-Dive",
                description:
                  "Evaluates problem clarity, technology depth, and missing business metrics with recruiter interview questions.",
                link: "/projects",
              },
              {
                icon: Compass,
                title: "12-Week Personalized Roadmap",
                description:
                  "Step-by-step milestones to systematically build missing projects, Docker containers, and cloud deployments.",
                link: "/roadmap",
              },
              {
                icon: MessagesSquare,
                title: "Resume-Grounded Interview Prep",
                description:
                  "Generates technical and project questions tied exclusively to verified skills and candidate projects.",
                link: "/interview",
              },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="rounded-2xl border border-sky-100 bg-white/80 p-6 flex flex-col justify-between hover:border-sky-300 hover:shadow-md transition-all group shadow-xs"
                >
                  <div>
                    <div className="h-11 w-11 rounded-xl bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-600 mb-4 group-hover:scale-105 transition-transform shadow-2xs">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-2">{feature.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">{feature.description}</p>
                  </div>
                  <Link
                    href={feature.link}
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 group-hover:text-sky-700 transition-colors"
                  >
                    <span>Explore module</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-6 border-t border-sky-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-sky-700 uppercase tracking-wider bg-sky-100 px-3 py-1 rounded-full border border-sky-200">
              Frequently Asked Questions
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
              How CareerLens AI Evaluates Resumes
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "How does CareerLens AI prevent hallucinating candidate skills?",
                a: "Our core architecture enforces the Zero-Fabrication Principle. If an attribute or framework is not explicitly stated in your resume text, the system marks it as 'Not found in resume' rather than inferring or assuming knowledge.",
              },
              {
                q: "Why use deterministic scoring instead of letting an LLM guess a score?",
                a: "LLMs can produce unpredictable scores with high variance. We compute scores using fixed mathematical weights (50% required skill overlap, 20% preferred, 10% projects, 10% experience, 10% keywords) and utilize Gemini strictly for qualitative recruiter explanations.",
              },
              {
                q: "Can I test the full platform without uploading my own resume first?",
                a: "Yes! CareerLens AI comes pre-loaded with 'Alex Rivera', a realistic demo candidate profile (B.Tech AI & Data Science) with intentional skill gaps and project strengths.",
              },
            ].map((faq, i) => (
              <div key={i} className="rounded-2xl border border-sky-100 bg-white/85 p-5 shadow-xs">
                <h4 className="text-sm font-bold text-slate-900 mb-2">{faq.q}</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-sky-100 bg-white/60 py-10 px-6 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-sky-600" />
            <span className="font-bold text-slate-800">CareerLens AI</span>
            <span>— Google Gemini Career Intelligence Platform</span>
          </div>
          <div>
            <span>Full Automation Active • Zero-Fabrication Architecture</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
