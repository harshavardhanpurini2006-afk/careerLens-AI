"use client";

import React, { useState } from "react";
import { AppShell } from "../../components/layout/AppShell";
import { mockInterviewSession } from "../../services/mockData";
import { interviewService } from "../../services/interviewService";
import { InterviewQuestion, InterviewEvaluation } from "../../types";
import {
  MessagesSquare,
  Sparkles,
  CheckCircle2,
  Mic,
  ArrowRight,
  HelpCircle,
  TrendingUp,
  FileText,
} from "lucide-react";

export default function InterviewPage() {
  const [session, setSession] = useState(mockInterviewSession);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [candidateAnswer, setCandidateAnswer] = useState(
    mockInterviewSession.evaluations["q-1"]?.candidateAnswer || ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeEvaluation, setActiveEvaluation] = useState<InterviewEvaluation | null>(
    mockInterviewSession.evaluations["q-1"] || null
  );

  const currentQ: InterviewQuestion = session.questions[currentQIndex];

  const handleSelectQuestion = (idx: number) => {
    setCurrentQIndex(idx);
    const q = session.questions[idx];
    const existingEval = session.evaluations[q.id];
    if (existingEval) {
      setCandidateAnswer(existingEval.candidateAnswer);
      setActiveEvaluation(existingEval);
    } else {
      setCandidateAnswer("");
      setActiveEvaluation(null);
    }
  };

  const handleSubmit = async () => {
    if (!candidateAnswer.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const evaluation = await interviewService.submitAnswer(
        session.id,
        currentQ.id,
        candidateAnswer
      );
      setActiveEvaluation(evaluation);
      setSession((prev) => ({
        ...prev,
        evaluations: { ...prev.evaluations, [currentQ.id]: evaluation },
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const wordCount = candidateAnswer.trim() ? candidateAnswer.trim().split(/\s+/).length : 0;

  return (
    <AppShell>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-sky-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-sky-700 uppercase tracking-wider bg-sky-100 px-2.5 py-0.5 rounded-full border border-sky-200">
                Interactive Simulation Engine
              </span>
              <span className="text-[10px] bg-sky-50 text-sky-800 border border-sky-200 px-2.5 py-0.5 rounded-full font-bold">
                Role: {session.targetRole} • {session.difficulty}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Resume-Grounded Interview Simulator
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              Questions Grounded In Your Resume
            </span>
          </div>
        </div>

        {/* Question Selector Tabs */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
          {session.questions.map((q, idx) => {
            const isAnswered = !!session.evaluations[q.id];
            const isCurrent = idx === currentQIndex;

            return (
              <button
                key={q.id}
                onClick={() => handleSelectQuestion(idx)}
                className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-2 ${
                  isCurrent
                    ? "bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-md shadow-sky-600/25"
                    : "bg-white/90 border border-sky-200 text-slate-700 hover:border-sky-300 hover:bg-sky-50 shadow-2xs"
                }`}
              >
                <span>Question {idx + 1}</span>
                {isAnswered && (
                  <CheckCircle2
                    className={`h-3.5 w-3.5 ${isCurrent ? "text-sky-200" : "text-emerald-600"}`}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Question Card */}
        <div className="rounded-3xl glass-panel p-6 sm:p-7 border border-sky-100/90 space-y-3.5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-sky-700 uppercase tracking-wider bg-sky-50 border border-sky-200 px-2.5 py-0.5 rounded-md">
                Category: {currentQ.category}
              </span>
              <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                Difficulty: {currentQ.difficulty}
              </span>
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
              <FileText className="h-3.5 w-3.5 text-sky-600" />
              <span>Grounded Context: {currentQ.sourceContext.detail}</span>
            </div>
          </div>

          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 leading-relaxed">
            {currentQ.questionText}
          </h2>
        </div>

        {/* Answer Input Workspace */}
        <div className="rounded-3xl glass-panel p-6 sm:p-7 border border-sky-100/90 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Your Answer (Text or Audio Simulation)
            </label>
            <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1 text-[11px] text-slate-400">
                <Mic className="h-3.5 w-3.5" />
                Audio mode coming in Phase 3
              </span>
              <span>{wordCount} words</span>
            </div>
          </div>

          <textarea
            value={candidateAnswer}
            onChange={(e) => setCandidateAnswer(e.target.value)}
            placeholder="Type your structured answer here. Use the STAR approach (Situation, Task, Action, Result) where relevant..."
            rows={6}
            className="w-full glass-input rounded-2xl p-4 text-xs sm:text-sm text-slate-800 placeholder-slate-400 leading-relaxed resize-none shadow-2xs"
          />

          <div className="flex items-center justify-end gap-3">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !candidateAnswer.trim()}
              className="px-6 py-3 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-500 hover:to-blue-500 shadow-md shadow-sky-600/25 disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <span className="h-3.5 w-3.5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  <span>Evaluating Technical Accuracy...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Evaluate Answer Against Recruiter Rubric</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Evaluation Feedback Panel */}
        {activeEvaluation && (
          <div className="rounded-3xl glass-panel p-6 sm:p-7 border border-sky-100/90 space-y-6 shadow-sm animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-sky-100">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4.5 w-4.5 text-sky-600" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Recruiter Rubric Evaluation
                </h3>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full shadow-2xs">
                Technical Accuracy: {activeEvaluation.technicalAccuracyScore}%
              </span>
            </div>

            {/* Rubric Score Bars */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              {[
                { label: "Technical Accuracy", score: activeEvaluation.technicalAccuracyScore },
                { label: "Clarity & Cadence", score: activeEvaluation.clarityScore },
                { label: "Completeness", score: activeEvaluation.completenessScore },
                { label: "Project Depth", score: activeEvaluation.projectUnderstandingScore },
              ].map((m, i) => (
                <div key={i} className="rounded-2xl border border-sky-100 bg-white/90 p-3.5 shadow-2xs">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    {m.label}
                  </div>
                  <div className="text-lg font-extrabold text-emerald-700">{m.score}%</div>
                </div>
              ))}
            </div>

            {/* Concise Feedback */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Evaluator Critique
              </span>
              <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed font-normal">
                {activeEvaluation.conciseFeedback}
              </p>
            </div>

            {/* Strengths & Improvement Tips */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-emerald-200 bg-white/90 p-4.5 space-y-2.5 shadow-xs">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                  Demonstrated Strengths
                </span>
                <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
                  {activeEvaluation.strengths.map((s, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-white/90 p-4.5 space-y-2.5 shadow-xs">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
                  How To Elevate This Answer
                </span>
                <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
                  {activeEvaluation.improvementTips.map((tip, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <TrendingUp className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Probing Follow-Up */}
            {activeEvaluation.recruiterFollowUp && (
              <div className="rounded-2xl border border-sky-200 bg-sky-50/80 p-4 text-xs shadow-2xs">
                <span className="text-[10px] font-bold text-sky-800 uppercase tracking-wider block mb-1">
                  Anticipated Recruiter Follow-Up Inquiry:
                </span>
                <p className="text-slate-800 italic font-medium">
                  "{activeEvaluation.recruiterFollowUp}"
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
