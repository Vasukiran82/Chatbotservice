// src/engine/IntentClassifier.ts
import fs from "fs";
import path from "path";
import Fuse from "fuse.js";
import type { ExecutableIntent } from "../types/intent";

const intentDir = path.join(__dirname, "../models/intents");
const intentFiles = fs.readdirSync(intentDir).filter(f => f.endsWith(".intent.ts"));

const intents: ExecutableIntent[] = intentFiles.map(file => {
  const filePath = path.join(intentDir, file);
  const module = require(filePath);
  return module.default as ExecutableIntent;
});

// Configure Fuse.js
const fuseOptions = {
  includeScore: true,
  keys: [
    { name: "keywords", weight: 0.7 },
    { name: "boostWords", weight: 0.3 }
  ],
  threshold: 0.6, // 0.0 = perfect match, 1.0 = match anything
  ignoreLocation: true,
};

const fuse = new Fuse(intents, fuseOptions);

export const classifyAndExecuteIntent = async (
  message: string,
  entities: any,
  sessionId: string
) => {
  // 1. Exact/Fuzzy Match using Fuse.js
  const results = fuse.search(message);

  let bestIntent: ExecutableIntent | null = null;
  let confidence = 0;

  if (results.length > 0) {
    const topMatch = results[0];
    // Fuse score is 0 (perfect) to 1 (bad). Invert it for confidence.
    // confidence = 1 - score
    const score = topMatch.score || 1;
    confidence = 1 - score;

    // Check min confidence
    if (confidence >= (topMatch.item.minConfidence || 0.4)) {
      bestIntent = topMatch.item;
    }
  }

  // 2. Fallback if no good match
  if (!bestIntent) {
    // Try to find a fallback intent explicitly
    bestIntent = intents.find(i => i.name === "fallback") || null;
    confidence = 0.1;
  }

  if (!bestIntent) {
    return {
      intent: "unknown",
      confidence: 0.0,
      response: "I'm not sure what you mean. Can you try saying it differently?",
    };
  }

  // 3. Execute
  let response: string;
  try {
    response = await bestIntent.execute(message, entities, sessionId);
  } catch (err) {
    console.error("Intent execution error:", err);
    response = "Something went wrong. Please try again.";
  }

  return {
    intent: bestIntent.name,
    confidence: Number(confidence.toFixed(3)),
    response,
  };
};