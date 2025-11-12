export type SessionId = string;

export interface ChatRequest {
  sessionId?: SessionId;
  message: string;
}

export interface ChatResponse {
  reply: string;
  intent?: string;
  slots?: Record<string, string>;
  actions?: Array<{ type: string; payload?: any }>;
}

export interface Rule {
  id: string;
  intent: string;
  patterns: string[];
  requiredSlots?: string[];
  response: string;
  action?: { type: string; payload?: any } | null;
}
