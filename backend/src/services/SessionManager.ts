// src/services/SessionManager.ts
import type { ChatSession } from "../types/session";

const sessions = new Map<string, ChatSession>();

export class SessionManager {
  static getOrCreate(sessionId: string): ChatSession {
    if (!sessions.has(sessionId)) {
      sessions.set(sessionId, {
        sessionId,
        messages: [],
        context: { unknownCount: 0 },
        lastActive: new Date(),
      });
    }
    const session = sessions.get(sessionId)!;
    session.lastActive = new Date();
    return session;
  }

  static addMessage(sessionId: string, role: "user" | "bot", content: string) {
    const session = this.getOrCreate(sessionId);
    session.messages.push({ role, content, timestamp: new Date() });
  }

  static save(sessionId: string, session: ChatSession) {
    sessions.set(sessionId, session);
  }
}