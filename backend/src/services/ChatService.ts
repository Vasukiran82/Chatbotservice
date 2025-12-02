import { SessionManager } from "./SessionManager"; // Correct — same folder
import { classifyAndExecuteIntent } from "../engine/IntentClassifier";
import { extractEntities } from "../engine/EntityExtractor";

export const processMessage = async (userMessage: string, sessionId: string = "default") => {
  const session = SessionManager.getOrCreate(sessionId);
  SessionManager.addMessage(sessionId, "user", userMessage);

  const entities = extractEntities(userMessage);

  const result = await classifyAndExecuteIntent(userMessage, entities, sessionId);

  const response = result.response || "Sorry, I couldn't process that.";

  SessionManager.addMessage(sessionId, "bot", response);
  SessionManager.save(sessionId, session);

  return {
    response,
    intent: result.intent,
    confidence: result.confidence,
    entities,
    sessionId,
    history: session.messages.slice(-10),
  };
};