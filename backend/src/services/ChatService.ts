import { SessionManager } from "./SessionManager";
import { classifyAndExecuteIntent } from "../engine/IntentClassifier";
import { extractEntities } from "../engine/EntityExtractor";

export const processMessage = async (
  userMessage: string,
  sessionId: string = "default"
) => {
  const session = SessionManager.getOrCreate(sessionId);

  // Save incoming user message
  SessionManager.addMessage(sessionId, "user", userMessage);

  // Extract entities if any
  const entities = extractEntities(userMessage);

  // Detect intent + fetch DB reply
  const result = await classifyAndExecuteIntent(userMessage, entities, sessionId);

  // Use DB response OR fallback
  const reply = result.response || "Sorry, I couldn't process that.";

  // Save bot reply
  SessionManager.addMessage(sessionId, "bot", reply);
  SessionManager.save(sessionId, session);

  // FINAL response object (clean)
  return {
    reply,                   // <-- THE IMPORTANT FIX
    intent: result.intent,
    confidence: result.confidence,
    entities,
    sessionId,
    history: session.messages.slice(-10),
  };
};
