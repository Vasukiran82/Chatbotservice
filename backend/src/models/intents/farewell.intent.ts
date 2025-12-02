// src/models/intents/farewell.intent.ts
export default {
  name: "farewell",
  keywords: ["bye", "goodbye", "see you", "later", "gtg", "cya", "take care", "thanks"],
  boostWords: ["have a good", "talk soon", "thank you"],
  weight: 0.90,
  minConfidence: 0.50,

  execute: () => {
    return "Goodbye! Have a great day!";
  }
};