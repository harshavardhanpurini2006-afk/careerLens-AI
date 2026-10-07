export interface ContextSource {
  type: "profile" | "role_gap" | "roadmap" | "rag";
  title: string;
  evidenceQuote?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  contextSources?: ContextSource[];
}
