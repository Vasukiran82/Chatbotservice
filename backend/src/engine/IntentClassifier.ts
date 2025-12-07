// src/engine/IntentClassifier.ts

import { ChatbotDataService } from "../services/ChatbotDataService";
import { logger } from "../utils/logger";
import { IChatbotIntent } from "../models/ChatbotIntent";

// Import intent executors
import trackOrderIntent from "../models/intents/trackOrder.intent";
import cancelOrderIntent from "../models/intents/cancelOrder.intent";

// All executor modules
const intentExecutors: Record<string, any> = {
  trackOrder: trackOrderIntent,
  cancelOrder: cancelOrderIntent,
};

// Utility to pick random response
const randomReply = (list: string[]) =>
  list[Math.floor(Math.random() * list.length)];

export const classifyAndExecuteIntent = async (
  message: string,
  entities: any,
  sessionId: string
) => {
  try {
    // Load Fuse.js matcher
    const fuse = await ChatbotDataService.getIntentFuse();
    const results = fuse.search(message);

    let bestIntent: IChatbotIntent | null = null;
    let confidence = 0;

    // ---------------------------
    // 1️⃣ FUSE INTENT MATCHING
    // ---------------------------
    if (results.length > 0) {
      const top = results[0];
      // Fuse score: 0 is perfect match, 1 is no match
      const score = top.score ?? 1;
      confidence = 1 - score;

      // Configurable threshold check
      if (confidence >= (top.item.minConfidence ?? 0.4)) {
        bestIntent = top.item;
      }
    }

    // ---------------------------------
    // 2️⃣ If no match → fallback intent
    // ---------------------------------
    if (!bestIntent) {
      const intents = await ChatbotDataService.getIntents();
      bestIntent = intents.find(i => i.name === "fallback") || null;
      confidence = 0.1; // very low
    }

    if (!bestIntent) {
      logger.warn("No fallback intent found in DB. using safe default.");
      return {
        intent: "fallback",
        confidence: 0,
        response: "I didn't quite get that. Could you try rephrasing?",
        reply: "I didn't quite get that. Could you try rephrasing?", // Compatible field
      };
    }

    // ---------------------------
    // 3️⃣ EXECUTE INTENT HANDLER OR DB RESPONSE
    // ---------------------------
    let response: string | null = null;
    const intentName = bestIntent.name;

    // A. Check for Code Executor
    const executor = intentExecutors[intentName];

    if (executor?.execute) {
      try {
        response = await executor.execute(message, entities, sessionId);
      } catch (err) {
        logger.error({ err, intent: intentName }, "Intent executor crashed");
        // Don't return yet, fall back to DB response
        response = null;
      }
    }

    // B. If no code response, check DB ChatbotResponse
    if (!response) {
      try {
        // This handles "If field is 'replies' (array) → pick random one"
        const dbResponses = await ChatbotDataService.getResponseForIntent(intentName);
        if (dbResponses && dbResponses.length > 0 && dbResponses[0] !== "I'm not sure how to respond to that.") {
          response = randomReply(dbResponses);
        }
      } catch (dbErr) {
        logger.error({ dbErr, intent: intentName }, "DB response fetch failed");
      }
    }

    // C. Final Fallback if everything failed
    if (!response) {
      response = randomReply([
        "Hi there! How can I assist you today?",
        "I'm here and ready to help—what would you like to know?",
        "Hmm… I couldn’t understand that. Could you try saying it differently?",
        "Still learning! You can ask me about orders, refunds, cancellations, or just say 'hi'!",
        `You said: "${message}" — I'm still learning how to respond to that.`
      ]);
    }

    // ---------------------------------
    // 5️⃣ Always return text in 'response' AND 'reply'
    // ---------------------------------
    return {
      intent: intentName,
      confidence: Number(confidence.toFixed(3)),
      response: response,
      reply: response, // The user specifically requested mapping to 'reply' or 'Reply'
    };

  } catch (error) {
    logger.error({ error }, "classifyAndExecuteIntent crashed");

    return {
      intent: "error",
      confidence: 0,
      response: "Oops! Something broke for a moment. Please try again!",
      reply: "Oops! Something broke for a moment. Please try again!",
    };
  }
};
