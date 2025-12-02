// src/middleware/sessionHandler.ts
import type { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";

// In-memory session store (replace with Redis/Mongo later)
interface ChatSession {
  id: string;
  createdAt: string;
  history: Array<{ role: "user" | "bot"; content: string; timestamp: string }>;
  context?: Record<string, any>;
}

const SESSIONS: Record<string, ChatSession> = {};

export const sessionHandler = (req: Request, _res: Response, next: NextFunction) => {
  let sessionId =
    (req.headers["x-session-id"] as string)?.trim() ||
    (req.body?.sessionId as string)?.trim();

  // Generate new session if none provided
  if (!sessionId) {
    sessionId = uuidv4();
    _res.setHeader("X-Session-Id", sessionId);
  }

  // Initialize session if it doesn't exist
  if (!SESSIONS[sessionId]) {
    SESSIONS[sessionId] = {
      id: sessionId,
      createdAt: new Date().toISOString(),
      history: [],
      context: {},
    };
  }

  // Attach session to request
  (req as any).session = SESSIONS[sessionId];
  (req as any).sessionId = sessionId;

  next();
};