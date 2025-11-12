import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";

const SESSIONS: Record<string, any> = {};

export function sessionHandler(req: Request, res: Response, next: NextFunction) {
  let sessionId = (req.headers["x-session-id"] as string) || req.body?.sessionId;

  if (!sessionId) {
    sessionId = uuidv4();
    res.setHeader("x-session-id", sessionId);
  }

  if (!SESSIONS[sessionId]) {
    SESSIONS[sessionId] = { id: sessionId, createdAt: new Date().toISOString(), history: [] };
  }

  
  (req as any).session = SESSIONS[sessionId];
  next();
}
