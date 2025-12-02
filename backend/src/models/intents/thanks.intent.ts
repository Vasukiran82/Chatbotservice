// src/models/intents/thanks.intent.ts
export default {
  name: "thanks",
  keywords: ["thanks", "thank you", "ty", "appreciate", "thankyou", "grateful"],
  boostWords: ["so much", "a lot", "helped", "great"],
  weight: 0.88,
  minConfidence: 0.50,

  execute: () => {
    return "You're welcome! Happy to help.";
  }
};