// src/controllers/chatController.ts
// ← REPLACE THE ENTIRE FILE WITH THIS

import type { Request, Response } from "express";
import { processMessage } from "../services/ChatService";
import { SessionManager } from "../services/SessionManager";
import { logger } from "../utils/logger";
import { success, error } from "../utils/response";
import { asyncHandler } from "../utils/asyncHandler";

export const sendMessage = asyncHandler(async (req: Request, res: Response) => {
  const { message, sessionId: providedSessionId } = req.body;

  // Validate input
  if (!message || typeof message !== "string") {
    logger.warn({ body: req.body, ip: req.ip }, "Invalid request - missing message");
    return error(res, "Message is required and must be a string", 400);
  }

  const sessionId =
    typeof providedSessionId === "string" && providedSessionId.trim()
      ? providedSessionId.trim()
      : `guest-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  // Process the message with your full engine
  const result = await processMessage(message.trim(), sessionId);

  logger.info(
    {
      sessionId,
      intent: result.intent,
      confidence: result.confidence,
      messageLength: message.length,
    },
    "Chat message processed"
  );

  // Return success with the actual reply as the message property for extra safety
  // The data object also contains result.reply
  return success(res, {
    ...result,
    sessionId,
  }, result.reply || "Message processed");
});

// Get chat history for a session
export const getHistory = asyncHandler(async (req: Request, res: Response) => {
  const { sessionId } = req.params;

  if (!sessionId) {
    return error(res, "sessionId is required", 400);
  }

  const session = SessionManager.getOrCreate(sessionId);

  logger.info({ sessionId }, "Conversation history retrieved");

  return success(res, {
    sessionId,
    messages: session.messages,
    context: session.context,
    lastActive: session.lastActive,
  });
});