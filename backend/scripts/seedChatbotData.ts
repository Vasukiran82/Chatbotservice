// scripts/seedChatbotData.ts

import mongoose from "mongoose";
import dotenv from "dotenv";
import { ChatbotIntent } from "../src/models/ChatbotIntent";
import { ChatbotResponse } from "../src/models/ChatbotResponse";
import { ChatbotFAQ } from "../src/models/ChatbotFAQ";
import { ProductKeyword } from "../src/models/ProductKeyword";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce_chatbot";

const intentsData = [
  // 1. Greetings & Small Talk
  {
    name: "greeting",
    keywords: ["hi", "hello", "hey", "heyo", "hola", "sup", "morning", "evening", "good day", "what's up", "howdy", "namaste", "yo", "greetings"],
    boostWords: ["there", "everyone", "back", "again", "friend"],
    weight: 0.95,
    minConfidence: 0.40,
    category: "Greetings & Small Talk",
    priority: 20,
    isActive: true,
  },

  // 2. Product Search, Browse, Recommendations
  {
    name: "product_search",
    keywords: ["show", "find", "search", "look for", "recommend", "suggest", "browse", "see", "want", "need", "looking", "shoes", "laptop", "dress", "phone", "watch", "bag", "headphones"],
    requiredKeywords: ["show", "find", "search", "recommend", "suggest", "browse", "want", "need"],
    boostWords: ["me", "some", "good", "best", "cheap", "new", "latest", "trending", "under", "below", "red", "black", "wireless"],
    weight: 0.96,
    minConfidence: 0.50,
    category: "Product Search, Browse, Recommendations",
    priority: 30,
    isActive: true,
  },

  // 3. Price, Size, Color, Stock, Details
  {
    name: "product_details",
    keywords: ["price", "cost", "how much", "size", "color", "available", "stock", "in stock,","details", "specification", "material", "warranty", "weight", "dimension"],
    boostWords: ["is", "of", "for", "this", "that", "does it", "come in", "have", "large", "small", "blue", "black"],
    weight: 0.94,
    minConfidence: 0.55,
    category: "Price, Size, Color, Stock, Details",
    priority: 28,
    isActive: true,
  },

  // 4. Add to Cart / Wishlist
  {
    name: "add_to_cart",
    keywords: ["add", "put", "cart", "bag", "wishlist", "save", "later", "favorite", "buy", "purchase"],
    requiredKeywords: ["add", "put", "cart", "wishlist", "save"],
    boostWords: ["to", "in", "my", "this", "these", "2", "two", "three"],
    weight: 0.97,
    minConfidence: 0.60,
    category: "Add to Cart / Wishlist",
    priority: 35,
    isActive: true,
  },

  // 5. Checkout & Place Order
  {
    name: "checkout",
    keywords: ["checkout", "buy now", "place order", "order", "pay", "complete", "proceed", "payment"],
    boostWords: ["now", "please", "quick", "fast", "guest"],
    weight: 0.98,
    minConfidence: 0.65,
    category: "Checkout & Place Order",
    priority: 40,
    isActive: true,
  },

  // 6. Track Order / Order Status
  {
    name: "track_order",
    keywords: ["track", "status", "where", "order", "delivery", "package", "shipped", "arrived", "delayed"],
    requiredKeywords: ["track", "status", "where", "order", "delivery"],
    boostWords: ["my", "number", "#", "please", "check", "yet"],
    weight: 0.96,
    minConfidence: 0.58,
    category: "Track Order / Order Status",
    priority: 32,
    isActive: true,
  },

  // 7. Cancel / Modify Order
  {
    name: "cancel_order",
    keywords: ["cancel", "stop", "remove", "change", "modify", "edit", "address", "item", "order"],
    boostWords: ["my", "please", "want to", "mistake", "wrong"],
    weight: 0.95,
    minConfidence: 0.62,
    category: "Cancel / Modify Order",
    priority: 30,
    isActive: true,
  },

  // 8. Payment Methods & Failed Payments
  {
    name: "payment_issue",
    keywords: ["payment", "failed", "declined", "card", "pay", "upi", "wallet", "cod", "not working", "error"],
    boostWords: ["my", "again", "retry", "why", "issue"],
    weight: 0.93,
    minConfidence: 0.55,
    category: "Payment Methods & Failed Payments",
    priority: 25,
    isActive: true,
  },

  // 9. Shipping, Delivery Time, Charges
  {
    name: "shipping_info",
    keywords: ["shipping", "delivery", "how long", "charge", "free", "express", "when", "arrive", "cost"],
    boostWords: ["time", "fast", "slow", "international", "india"],
    weight: 0.94,
    minConfidence: 0.52,
    category: "Shipping, Delivery Time, Charges",
    priority: 27,
    isActive: true,
  },

  // 10. Returns, Refunds, Exchange
  {
    name: "return_refund",
    keywords: ["return", "refund", "exchange", "send back", "replace", "defective", "wrong item"],
    boostWords: ["want to", "how to", "policy", "within"],
    weight: 0.95,
    minConfidence: 0.60,
    category: "Returns, Refunds, Exchange",
    priority: 29,
    isActive: true,
  },

  // 11. Coupons, Offers, Discounts
  {
    name: "coupon_discount",
    keywords: ["coupon", "discount", "offer", "promo", "code", "deal", "sale", "voucher"],
    boostWords: ["apply", "have", "any", "today", "working"],
    weight: 0.92,
    minConfidence: 0.50,
    category: "Coupons, Offers, Discounts",
    priority: 26,
    isActive: true,
  },

  // 12. Account, Login, Profile
  {
    name: "account_help",
    keywords: ["login", "account", "password", "forgot", "profile", "email", "phone", "update"],
    boostWords: ["can't", "not", "change", "verify"],
    weight: 0.91,
    minConfidence: 0.55,
    category: "Account, Login, Profile",
    priority: 22,
    isActive: true,
  },

  // 13. Support & Live Agent Handover
  {
    name: "live_agent",
    keywords: ["human", "agent", "person", "talk to", "customer care", "support", "help", "representative"],
    boostWords: ["real", "live", "now", "urgent", "please"],
    weight: 0.99,
    minConfidence: 0.70,
    category: "Support & Live Agent Handover",
    priority: 50,
    isActive: true,
  },

  // 14. Thank You & Goodbyes
  {
    name: "thank_you",
    keywords: ["thanks", "thank you", "appreciate", "grateful", "awesome", "helpful", "good job"],
    boostWords: ["so much", "very", "really", "a lot"],
    weight: 0.90,
    minConfidence: 0.45,
    category: "Thank You & Goodbyes",
    priority: 15,
    isActive: true,
  },

  // 15. Fallback / Confusion
  {
    name: "fallback",
    keywords: ["what", "huh", "don't understand", "confused", "again", "repeat", "not sure"],
    boostWords: [],
    weight: 0.40,
    minConfidence: 0.10,
    category: "Fallback / Confusion",
    priority: 1,
    isActive: true,
  },
];

const responsesData = [
  { intentName: "greeting", responses: ["Hello! How can I help you today?", "Hi there! Welcome back!", "Hey! What are you shopping for?", "Greetings! Ready to assist you!"], responseType: "text", isActive: true },
  { intentName: "product_search", responses: ["Sure! What kind of product are you looking for?", "Let me help you find that. Can you tell me more?", "Searching for the best matches...", "Here are some great options for you!"], responseType: "text", isActive: true },
  { intentName: "product_details", responses: ["Let me check the details for you...", "Here's all the info about this product:", "Price, sizes, colors — got it all!", "Yes, it's in stock!"], responseType: "text", isActive: true },
  { intentName: "add_to_cart", responses: ["Added to your cart!", "Done! It's in your bag.", "Saved to wishlist!", "Great choice! Anything else?"], responseType: "text", isActive: true },
  { intentName: "checkout", responses: ["Taking you to checkout now...", "Ready to place your order?", "Let me help you complete the purchase!", "Secure checkout is ready!"], responseType: "text", isActive: true },
  { intentName: "track_order", responses: ["Please share your order number and I'll track it!", "Let me check your order status...", "Your package is on the way!", "Expected delivery: tomorrow"], responseType: "text", isActive: true },
  { intentName: "cancel_order", responses: ["I can help you cancel. Please confirm your order number.", "Sorry you're canceling. Let me process that.", "Cancellation request received!"], responseType: "text", isActive: true },
  { intentName: "payment_issue", responses: ["Let me help fix the payment issue.", "Try again or use another method?", "Payment failed? Don't worry, let's retry!"], responseType: "text", isActive: true },
  { intentName: "shipping_info", responses: ["Standard delivery: 5–7 days. Express: 2–3 days.", "Free shipping on orders above ₹999!", "Yes, we ship to your location!"], responseType: "text", isActive: true },
  { intentName: "return_refund", responses: ["You can return within 30 days. Easy process!", "Initiating return for you...", "Refund will be processed in 3–5 days."], responseType: "text", isActive: true },
  { intentName: "coupon_discount", responses: ["Use code WELCOME10 for 10% off!", "Big sale is live now!", "Let me find active offers for you!"], responseType: "text", isActive: true },
  { intentName: "account_help", responses: ["Having login issues? Let me guide you.", "Check your email for password reset link.", "Profile updated successfully!"], responseType: "text", isActive: true },
  { intentName: "live_agent", responses: ["Connecting you to a human agent now...", "One moment, transferring to support team!", "Live agent will join shortly. Thank you for waiting!"], responseType: "text", isActive: true },
  { intentName: "thank_you", responses: ["You're most welcome!", "Happy to help!", "Anytime!", "Have a great day!"], responseType: "text", isActive: true },
  { intentName: "fallback", responses: ["I'm not sure I understood. Can you rephrase?", "Hmm, let me think... Still learning!", "Could you say that differently?", "One more time, please?"], responseType: "text", isActive: true },
];

const faqsData = [
  { question: "What is your return policy?", answer: "30-day return policy. Items must be unused with tags.", keywords: ["return", "refund", "policy"], category: "returns", priority: 20, isActive: true },
  { question: "How can I track my order?", answer: "Go to 'My Orders' or say 'track order #12345'", keywords: ["track", "status", "delivery"], category: "orders", priority: 25, isActive: true },
  { question: "Do you offer free shipping?", answer: "Yes! Free shipping on all orders above ₹999.", keywords: ["free", "shipping", "delivery"], category: "shipping", priority: 18, isActive: true },
  { question: "What payment methods are accepted?", answer: "Credit/Debit Cards, UPI, Wallets, Net Banking, COD.", keywords: ["payment", "pay", "card"], category: "payment", priority: 22, isActive: true },
  { question: "Can I cancel my order?", answer: "Yes, if not shipped yet. Contact us within 1 hour.", keywords: ["cancel", "order"], category: "orders", priority: 20, isActive: true },
  { question: "How long does delivery take?", answer: "Standard: 5–7 days | Express: 2–3 days", keywords: ["delivery", "time", "long"], category: "shipping", priority: 19, isActive: true },
  { question: "Do you ship internationally?", answer: "Yes! We ship to 50+ countries.", keywords: ["international", "abroad"], category: "shipping", priority: 15, isActive: true },
  { question: "How to apply a coupon code?", answer: "Enter code at checkout in the 'Promo Code' field.", keywords: ["coupon", "discount", "code"], category: "offers", priority: 17, isActive: true },
  { question: "What if I receive a damaged product?", answer: "We'll replace it free of cost. Initiate return within 7 days.", keywords: ["damaged", "defective"], category: "returns", priority: 21, isActive: true },
  { question: "Is Cash on Delivery available?", answer: "Yes! COD available pan-India with ₹50 fee.", keywords: ["cod", "cash"], category: "payment", priority: 16, isActive: true },
  { question: "How to reset my password?", answer: "Click 'Forgot Password' on login page.", keywords: ["password", "forgot"], category: "account", priority: 18, isActive: true },
  { question: "Do you have a mobile app?", answer: "Yes! Download from Play Store or App Store.", keywords: ["app", "mobile"], category: "general", priority: 12, isActive: true },
  { question: "Can I change my delivery address?", answer: "Yes, before dispatch. Contact support.", keywords: ["address", "change"], category: "orders", priority: 16, isActive: true },
  { question: "Are products original?", answer: "100% authentic. We source directly from brands.", keywords: ["original", "genuine", "fake"], category: "general", priority: 20, isActive: true },
  { question: "How to contact customer support?", answer: "Chat here or email support@youstore.com", keywords: ["contact", "help", "support"], category: "support", priority: 25, isActive: true },
  { question: "What are your working hours?", answer: "Support available 9 AM – 9 PM, 7 days a week.", keywords: ["hours", "time", "open"], category: "support", priority: 14, isActive: true },
];

const productKeywordsData = [
  { keyword: "red shoes", productIds: [], category: "footwear", priority: 15, isActive: true },
  { keyword: "wireless earbuds", productIds: [], category: "electronics", priority: 18, isActive: true },
  { keyword: "laptop", productIds: [], category: "electronics", priority: 20, isActive: true },
  { keyword: "summer dress", productIds: [], category: "clothing", priority: 16, isActive: true },
  { keyword: "smart watch", productIds: [], category: "electronics", priority: 19, isActive: true },
  { keyword: "backpack", productIds: [], category: "bags", priority: 14, isActive: true },
  { keyword: "t-shirt", productIds: [], category: "clothing", priority: 17, isActive: true },
];

async function seedDatabase() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected successfully!");

    await Promise.all([
      ChatbotIntent.deleteMany({}),
      ChatbotResponse.deleteMany({}),
      ChatbotFAQ.deleteMany({}),
      ProductKeyword.deleteMany({}),
    ]);

    await ChatbotIntent.insertMany(intentsData);
    await ChatbotResponse.insertMany(responsesData);
    await ChatbotFAQ.insertMany(faqsData);
    await ProductKeyword.insertMany(productKeywordsData);

    console.log("Chatbot data seeded successfully!");
    console.log(`Intents: ${intentsData.length} | Responses: ${responsesData.length} | FAQs: ${faqsData.length}`);

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seedDatabase();