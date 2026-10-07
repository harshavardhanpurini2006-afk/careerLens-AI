"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Send, Bot, Sparkles, User, RefreshCw, Layers, ShieldCheck, ArrowRight } from "lucide-react";
import { useCareerLens } from "../../context/CareerLensContext";
import { chatService } from "../../services/chatService";
import { ChatMessage } from "../../types";

const SUGGESTED_PROMPTS = [
  "Why is AI Engineer my top match?",
  "What is my biggest skill gap?",
  "How can I containerize my ML project?",
  "Generate 3 technical interview questions for me.",
];

export function CopilotDrawer() {
  const { isCopilotOpen, closeCopilot, activeResume } = useCareerLens();
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

  if (!isCopilotOpen) return null;

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
        content: "I ran into a temporary issue retrieving analysis. Please try submitting again.",
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
    <div className="fixed inset-0 z-50 flex justify-end bg-sky-950/20 backdrop-blur-xs transition-opacity animate-fade-in">
      {/* Click outside backdrop */}
      <div className="flex-1" onClick={closeCopilot} />

      {/* Glass Drawer Panel */}
      <div className="w-full max-w-lg bg-white/92 backdrop-blur-2xl border-l border-sky-200/90 flex flex-col h-full shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-sky-100 flex items-center justify-between bg-gradient-to-r from-sky-50/80 via-white to-blue-50/60">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/25">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">CareerLens Copilot</h3>
                <span className="text-[10px] font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full border border-sky-300">
                  Gemini AI
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Real-time candidate evidence & role benchmarking</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => chatService.getInitialMessages().then(setMessages)}
              className="p-2 text-slate-400 hover:text-sky-600 rounded-xl hover:bg-sky-50 transition-colors"
              title="Reset Chat"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            <button
              onClick={closeCopilot}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-sky-50 transition-colors"
              aria-label="Close Assistant"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-gradient-to-b from-sky-50/20 via-transparent to-sky-50/40">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-xs">
                  <Bot className="h-4.5 w-4.5" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl px-4.5 py-3.5 text-xs sm:text-[13px] leading-relaxed shadow-xs ${
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
                        className="text-[10px] text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200/70 font-semibold"
                      >
                        Source: {source.title}
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
                <div className="h-8 w-8 rounded-xl bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-700 shrink-0 mt-0.5 shadow-2xs">
                  <User className="h-4.5 w-4.5" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shrink-0">
                <Bot className="h-4.5 w-4.5" />
              </div>
              <div className="rounded-2xl rounded-bl-xs px-4 py-3 bg-white/95 border border-sky-200 text-slate-600 text-xs flex items-center gap-2.5 shadow-xs">
                <span className="h-2 w-2 rounded-full bg-sky-500 animate-ping" />
                <span className="font-medium text-sky-800">Gemini AI is analyzing resume evidence & benchmarks...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts Chips */}
        <div className="p-3.5 border-t border-sky-100 bg-white/70 backdrop-blur-md">
          <div className="text-[10px] font-bold text-sky-900/70 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="h-3 w-3 text-sky-500" />
            Recommended Prompts
          </div>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                disabled={isLoading}
                className="text-[11px] font-medium text-slate-700 bg-white/90 border border-sky-200/80 hover:border-sky-400 hover:bg-sky-50 hover:text-sky-800 px-3 py-1.5 rounded-xl transition-all text-left shadow-2xs cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3.5 border-t border-sky-100 bg-white/95">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about candidate fit, skill gaps, or interview readiness..."
              className="flex-1 glass-input rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400"
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className="p-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-500 hover:to-blue-500 disabled:opacity-50 transition-all cursor-pointer shadow-sm shadow-sky-600/20"
              aria-label="Send Message"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
