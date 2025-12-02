// src/models/intents/greeting.intent.ts
export default {
  name: "greeting",
  keywords: ["hi", "hello", "hey", "heyo", "hola", "sup", "morning", "evening", "good", "what's up", "howdy"],
  boostWords: ["there", "back", "again", "everyone", "team"],
  weight: 0.92,
  minConfidence: 0.45,
  description: "User is saying hello or starting conversation",

  execute: () => {
    const greetings = [
      "Hello! How can I help you today?",
      "Hi there! What can I do for you?",
      "Greetings! How may I assist you?",
      "Hello! I'm here to help with your orders."
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }
};