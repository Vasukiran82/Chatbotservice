// src/types/session.ts
export interface ChatContext {
  currentFlow?: string | undefined;
  awaiting?: string | undefined;
  collected?: Record<string, any>;
  unknownCount: number;
}

export interface ChatSession {
  sessionId: string;
  messages: Array<{
    role: "user" | "bot";
    content: string;
    timestamp: Date;
  }>;
  context: ChatContext;
  lastActive: Date;
}