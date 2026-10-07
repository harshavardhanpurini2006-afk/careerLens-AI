"use client";

import React, { useState, useEffect, useRef } from "react";
import { AppShell } from "../../components/layout/AppShell";
import { useCareerLens } from "../../context/CareerLensContext";
import { chatService } from "../../services/chatService";
import { ChatMessage } from "../../types";
import { Bot, Send, Sparkles, User, RefreshCw, Zap } from "lucide-react";

const SUGGESTIONS = [
  "Why is AI Engineer my top match?",
  "What is my biggest skill gap?",
  "How can I package my churn project in Docker?",
  "Prepare me for an AI Engineer technical interview.",
];

export default function CopilotPage() {
  const { activeResume } = useCareerLens();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatService.getInitialMessages().then((initial) => setMessages(initial));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await chatService.sendMessage(
        query,
        messages,
        activeResume?.id || "61252407-48bf-4709-8e64-c4086bf09acf",
        "AI Engineer"
      );
      setMessages((prev) => [...prev, response]);
    } catch {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content: "I encountered an issue processing your request. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-8.5rem)] rounded-3xl glass-card overflow-hidden shadow-xl border border-sky-200/90">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-sky-100 bg-white/70 backdrop-blur-xl flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/25">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                CareerLens AI Copilot
                <span className="text-[10px] font-bold text-sky-700 bg-sky-100 border border-sky-300 px-2 py-0.5 rounded-full">
                  Gemini 3.5 Engine
                </span>
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Grounded in candidate resume evidence & recruiter benchmark standards
              </p>
            </div>
          </div>

          <button
            onClick={() => chatService.getInitialMessages().then(setMessages)}
            className="p-2.5 text-slate-400 hover:text-sky-600 rounded-xl hover:bg-sky-50 transition-colors cursor-pointer"
            title="Reset Conversation"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gradient-to-b from-sky-50/20 via-transparent to-sky-50/30">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="h-8.5 w-8.5 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-xs">
                  <Bot className="h-4.5 w-4.5" />
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-2xl px-5 py-3.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-br-xs shadow-sky-600/20"
                    : "bg-white/95 border border-sky-100/90 text-slate-800 rounded-bl-xs shadow-sky-950/5"
                }`}
              >
                <div className="whitespace-pre-wrap font-normal">{msg.content}</div>

                {msg.contextSources && msg.contextSources.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-sky-100 flex flex-wrap gap-1.5">
                    {msg.contextSources.map((source, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200/80 font-semibold"
                      >
                        Grounding Source: {source.title}
                      </span>
                    ))}
                  </div>
                )}

                <div
                  className={`mt-1.5 text-[10px] ${
                    msg.role === "user" ? "text-sky-100 text-right" : "text-slate-400"
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {msg.role === "user" && (
                <div className="h-8.5 w-8.5 rounded-xl bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-700 shrink-0 mt-0.5 shadow-2xs">
                  <User className="h-4.5 w-4.5" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3.5">
              <div className="h-8.5 w-8.5 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shrink-0">
                <Bot className="h-4.5 w-4.5" />
              </div>
              <div className="rounded-2xl rounded-bl-xs px-5 py-3.5 bg-white/95 border border-sky-200 text-slate-600 text-xs sm:text-sm flex items-center gap-2.5 shadow-xs">
                <span className="h-2 w-2 rounded-full bg-sky-500 animate-ping" />
                <span className="font-medium text-sky-800">
                  Gemini AI evaluating candidate evidence and benchmark standards...
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts */}
        <div className="p-4 border-t border-sky-100 bg-white/70 backdrop-blur-md">
          <div className="text-[10px] font-bold text-sky-900/70 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Zap className="h-3 w-3 text-sky-500" />
            Suggested Career Inquiries
          </div>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                onClick={() => handleSend(s)}
                disabled={isLoading}
                className="text-xs font-medium text-slate-700 bg-white/90 border border-sky-200 hover:border-sky-400 hover:bg-sky-50 hover:text-sky-800 px-3 py-1.5 rounded-xl transition-all shadow-2xs cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-sky-100 bg-white/95">
          <div className="flex items-center gap-2.5">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about your resume, skill gaps, or interview readiness..."
              className="flex-1 glass-input rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400"
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className="p-3 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-500 hover:to-blue-500 disabled:opacity-50 transition-all cursor-pointer shadow-sm shadow-sky-600/25"
              aria-label="Send Message"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
