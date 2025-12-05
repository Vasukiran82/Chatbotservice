// src/engine/IntentClassifier.ts
import { ChatbotDataService } from "../services/ChatbotDataService";
import { logger } from "../utils/logger";
import { IChatbotIntent } from "../models/ChatbotIntent";

// Import intent executors (we'll keep the execute logic separate)
import greetingIntent from "../models/intents/greeting.intent";
import farewellIntent from "../models/intents/farewell.intent";
import trackOrderIntent from "../models/intents/trackOrder.intent";
import cancelOrderIntent from "../models/intents/cancelOrder.intent";
import thanksIntent from "../models/intents/thanks.intent";
import complaintIntent from "../models/intents/complaint.intent";
import fallbackIntent from "../models/intents/fallback.intent";

// Map of intent executors
const intentExecutors: Record<string, any> = {
  greeting: greetingIntent,
  farewell: farewellIntent,
  trackOrder: trackOrderIntent,
  cancelOrder: cancelOrderIntent,
  thanks: thanksIntent,
  complaint: complaintIntent,
  fallback: fallbackIntent,
};

export const classifyAndExecuteIntent = async (
  message: string,
  entities: any,
  sessionId: string
) => {
  try {
    // 1. Get Fuse instance from service (loads from DB if needed)
    const fuse = await ChatbotDataService.getIntentFuse();

    // 2. Fuzzy match using Fuse.js
    const results = fuse.search(message);

    let bestIntent: IChatbotIntent | null = null;
    let confidence = 0;

    if (results.length > 0) {
      const topMatch = results[0];
      // Fuse score is 0 (perfect) to 1 (bad). Invert it for confidence.
      const score = topMatch.score || 1;
      confidence = 1 - score;

      // Check min confidence
      if (confidence >= (topMatch.item.minConfidence || 0.4)) {
        bestIntent = topMatch.item;
      }
    }

    // 3. Fallback if no good match
    if (!bestIntent) {
      // Try to find a fallback intent
      const intents = await ChatbotDataService.getIntents();
      bestIntent = intents.find((i) => i.name === "fallback") || null;
      confidence = 0.1;
    }

    if (!bestIntent) {
      return {
        intent: "unknown",
        confidence: 0.0,
        response: "I'm not sure what you mean. Can you try saying it differently?",
      };
    }

    // 4. Execute intent
    let response: string;
    try {
      const executor = intentExecutors[bestIntent.name];

      if (executor && typeof executor.execute === "function") {
        // Use the executor's execute function
        response = await executor.execute(message, entities, sessionId);
      } else {
        // Fallback to getting a random response from the database
        response = await ChatbotDataService.getRandomResponse(bestIntent.name);
      }
    } catch (err) {
      logger.error({ error: err, intent: bestIntent.name }, "Intent execution error");
      response = "Something went wrong. Please try again.";
    }

    return {
      intent: bestIntent.name,
      confidence: Number(confidence.toFixed(3)),
      response,
    };
  } catch (error) {
    logger.error({ error }, "Error in classifyAndExecuteIntent");
    return {
      intent: "error",
      confidence: 0.0,
      response: "I'm having trouble processing your request. Please try again.",
    };
  }
};