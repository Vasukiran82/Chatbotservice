// src/engine/IntentClassifier.ts

import { ChatbotDataService } from "../services/ChatbotDataService";
import { logger } from "../utils/logger";
import { IChatbotIntent } from "../models/ChatbotIntent";

// Import intent executors
import greetingIntent from "../models/intents/greeting.intent";
import farewellIntent from "../models/intents/farewell.intent";
import trackOrderIntent from "../models/intents/trackOrder.intent";
import cancelOrderIntent from "../models/intents/cancelOrder.intent";
import thanksIntent from "../models/intents/thanks.intent";
import complaintIntent from "../models/intents/complaint.intent";
import fallbackIntent from "../models/intents/fallback.intent";

// All executor modules
const intentExecutors: Record<string, any> = {
  greeting: greetingIntent,
  farewell: farewellIntent,
  trackOrder: trackOrderIntent,
  cancelOrder: cancelOrderIntent,
  thanks: thanksIntent,
  complaint: complaintIntent,
  fallback: fallbackIntent,
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
      const score = top.score ?? 1;
      confidence = 1 - score;

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

    // ---------------------------
    // 3️⃣ EXECUTE INTENT HANDLER
    // ---------------------------
    let response: string;

    const executor = bestIntent ? intentExecutors[bestIntent.name] : null;

    if (bestIntent && executor?.execute) {
      try {
        response = await executor.execute(message, entities, sessionId);
      } catch (err) {
        logger.error(err, "Intent executor crashed");

        // graceful fallback
        response = `I understood your intent was: "${bestIntent.name}".`;
      }
    } else {
      // ---------------------------------------------
      // 4️⃣ FINAL HUMAN-LIKE FALLBACK (ALWAYS RETURNS)
      // ---------------------------------------------
      response = randomReply([
        "Hi there! How can I assist you today?",
        "I'm here and ready to help—what would you like to know?",
        "Hmm… I couldn’t understand that. Could you try saying it differently?",
        "Still learning! You can ask me about orders, refunds, cancellations, or just say 'hi'!",
        `You said: "${message}" — I'm still learning how to respond to that.`,
        "Hello! Feel free to ask me anything.",
      ]);
    }

    // ---------------------------------
    // 5️⃣ Always return a proper payload
    // ---------------------------------
    return {
      intent: bestIntent?.name || "fallback",
      confidence: Number(confidence.toFixed(3)),
      response,
    };

  } catch (error) {
    logger.error({ error }, "classifyAndExecuteIntent crashed");

    return {
      intent: "error",
      confidence: 0,
      response: "Oops! Something broke for a moment. Please try again!",
    };
  }
};
