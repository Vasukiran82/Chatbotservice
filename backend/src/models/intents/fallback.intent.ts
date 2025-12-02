// src/models/intents/fallback.intent.ts
export default {
  name: "fallback",
  keywords: [], // matches everything with low confidence
  weight: 0.1,
  minConfidence: 0.0,
  maxConfidence: 0.55, // only wins if no other intent scores higher
  description: "Catch-all for unrecognized input",

  execute: () => {
    return "I'm not sure I understand. Could you please rephrase that? I can help you track orders, check status, or answer general questions.";
  }
};