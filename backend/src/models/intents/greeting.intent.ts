// src/models/intents/greeting.intent.ts
import { ChatbotDataService } from "../../services/ChatbotDataService";

export default {
  name: "greeting",
  keywords: ["hi", "hello", "hey", "heyo", "hola", "sup", "morning", "evening", "good", "what's up", "howdy"],
  boostWords: ["there", "back", "again", "everyone", "team"],
  weight: 0.92,
  minConfidence: 0.45,
  description: "User is saying hello or starting conversation",

  execute: async () => {
    // Fetch responses from database
    const response = await ChatbotDataService.getRandomResponse("greeting");
    return response;
  }
};