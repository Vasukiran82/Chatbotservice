// src/engine/ResponseSelector.ts
const RESPONSES = {
  greeting: [
    "Hey there! How can I help you today?",
    "Hello! Welcome back!",
    "Hi! What’s on your mind?",
    "Hey! Great to see you!",
  ],
  farewell: [
    "Goodbye! Have a great day!",
    "See you later!",
    "Take care!",
    "Bye! Come back soon!",
  ],
  trackOrder: [
    "Sure! Please share your order number (e.g. #ABC123)",
    "I can check that for you! What’s your order ID?",
    "Of course! Just tell me the order number.",
  ],
  cancelOrder: [
    "I can help cancel your order. Please provide the order number.",
    "Sure, let’s cancel that. What’s your order ID?",
  ],
  refund: [
    "I’ll help you with the refund. Please share your order number.",
    "Refund request noted. What’s the order number?",
  ],
  thanks: [
    "You’re welcome!",
    "Happy to help!",
    "Anytime!",
    "My pleasure!",
  ],
  complaint: [
    "I’m really sorry to hear that. Let me help fix this.",
    "That’s not good. I’ll escalate this right away.",
  ],
  fallback: [
    "I’m not quite sure what you mean. Can you try saying it differently?",
    "Hmm, I didn’t catch that. Could you rephrase?",
    "I’m still learning! Can you say that another way?",
  ],
} as const;

type IntentKey = keyof typeof RESPONSES;

export const selectResponse = (intent: string, confidence: number): string => {
  // Low confidence → always clarify
  if (confidence < 0.55) {
    return "I'm not quite sure I understood. Can you rephrase that?";
  }

  // Safely get responses for the intent
  const intentKey = intent in RESPONSES ? (intent as IntentKey) : "fallback";
  const responseList = RESPONSES[intentKey];

  // Pick random variation
  const randomIndex = Math.floor(Math.random() * responseList.length);
  return responseList[randomIndex];
};