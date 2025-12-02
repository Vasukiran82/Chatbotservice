// src/models/intents/complaint.intent.ts
export default {
  name: "complaint",
  keywords: ["problem", "issue", "not working", "broken", "wrong", "late", "never arrived", "help"],
  boostWords: ["urgent", "angry", "disappointed", "terrible"],
  weight: 0.94,
  minConfidence: 0.60,

  execute: () => {
    return "I'm very sorry to hear that you're experiencing issues. Please provide more details so I can assist you better, or you can type 'agent' to speak with a human representative.";
  }
};