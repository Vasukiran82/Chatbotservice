// src/models/intents/cancelOrder.intent.ts
export default {
  name: "cancelOrder",
  keywords: ["cancel", "stop", "don’t want", "return", "refund", "cancelled", "remove", "delete"],
  requiredKeywords: ["cancel", "stop", "refund", "return"],
  boostWords: ["order", "my", "purchase", "immediately", "now", "please"],
  weight: 0.98,
  minConfidence: 0.70,
  description: "User wants to cancel or return an order",

  execute: (_message: string, _entities: any) => {
    return "To cancel or return an order, please visit the 'My Orders' section in your account settings. If you need further assistance, please contact our support hotline.";
  }
};