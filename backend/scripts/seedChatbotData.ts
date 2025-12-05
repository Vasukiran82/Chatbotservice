// scripts/seedChatbotData.ts
import mongoose from "mongoose";
import dotenv from "dotenv";
import { ChatbotIntent } from "../src/models/ChatbotIntent";
import { ChatbotResponse } from "../src/models/ChatbotResponse";
import { ChatbotFAQ } from "../src/models/ChatbotFAQ";
import { ProductKeyword } from "../src/models/ProductKeyword";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/chatbot";

const intentsData = [
    {
        name: "greeting",
        keywords: ["hi", "hello", "hey", "heyo", "hola", "sup", "morning", "evening", "good", "what's up", "howdy"],
        boostWords: ["there", "back", "again", "everyone", "team"],
        weight: 0.92,
        minConfidence: 0.45,
        category: "general",
        priority: 10,
        isActive: true,
    },
    {
        name: "farewell",
        keywords: ["bye", "goodbye", "see you", "later", "farewell", "cya", "peace", "take care"],
        boostWords: ["soon", "tomorrow", "next time"],
        weight: 0.90,
        minConfidence: 0.50,
        category: "general",
        priority: 9,
        isActive: true,
    },
    {
        name: "trackOrder",
        keywords: ["track", "status", "where", "order", "delivery", "package", "shipped", "arrived"],
        requiredKeywords: ["track", "status", "where", "order", "delivery"],
        boostWords: ["my", "number", "#", "please", "check"],
        weight: 0.95,
        minConfidence: 0.55,
        category: "orders",
        priority: 15,
        isActive: true,
    },
    {
        name: "cancelOrder",
        keywords: ["cancel", "stop", "abort", "remove", "delete", "order"],
        boostWords: ["my", "please", "want to"],
        weight: 0.93,
        minConfidence: 0.60,
        category: "orders",
        priority: 14,
        isActive: true,
    },
    {
        name: "thanks",
        keywords: ["thanks", "thank you", "appreciate", "grateful", "awesome", "great"],
        boostWords: ["much", "lot", "really", "so"],
        weight: 0.88,
        minConfidence: 0.45,
        category: "general",
        priority: 5,
        isActive: true,
    },
    {
        name: "complaint",
        keywords: ["complaint", "issue", "problem", "wrong", "bad", "terrible", "awful", "disappointed"],
        boostWords: ["very", "really", "extremely", "not happy"],
        weight: 0.90,
        minConfidence: 0.50,
        category: "support",
        priority: 12,
        isActive: true,
    },
    {
        name: "fallback",
        keywords: ["help", "what", "how", "can you"],
        boostWords: [],
        weight: 0.50,
        minConfidence: 0.10,
        category: "general",
        priority: 1,
        isActive: true,
    },
];

const responsesData = [
    {
        intentName: "greeting",
        responses: [
            "Hello! How can I help you today?",
            "Hi there! What can I do for you?",
            "Greetings! How may I assist you?",
            "Hello! I'm here to help with your orders.",
            "Hey! Great to see you! What do you need?",
        ],
        responseType: "text",
        isActive: true,
    },
    {
        intentName: "farewell",
        responses: [
            "Goodbye! Have a great day!",
            "See you later!",
            "Take care!",
            "Bye! Come back soon!",
            "Have a wonderful day ahead!",
        ],
        responseType: "text",
        isActive: true,
    },
    {
        intentName: "thanks",
        responses: [
            "You're welcome!",
            "Happy to help!",
            "Anytime!",
            "My pleasure!",
            "Glad I could assist!",
        ],
        responseType: "text",
        isActive: true,
    },
    {
        intentName: "complaint",
        responses: [
            "I'm really sorry to hear that. Let me help fix this.",
            "That's not good. I'll escalate this right away.",
            "I apologize for the inconvenience. Let me see what I can do.",
            "I understand your frustration. Let's resolve this together.",
        ],
        responseType: "text",
        isActive: true,
    },
    {
        intentName: "fallback",
        responses: [
            "I'm not quite sure what you mean. Can you try saying it differently?",
            "Hmm, I didn't catch that. Could you rephrase?",
            "I'm still learning! Can you say that another way?",
            "I'm not sure I understood. Could you clarify?",
        ],
        responseType: "text",
        isActive: true,
    },
];

const faqsData = [
    {
        question: "What are your shipping options?",
        answer: "We offer standard (5-7 days), express (2-3 days), and overnight shipping. Shipping costs vary by location and speed.",
        keywords: ["shipping", "delivery", "options", "how long", "ship"],
        category: "shipping",
        priority: 10,
        isActive: true,
    },
    {
        question: "What is your return policy?",
        answer: "You can return items within 30 days of delivery for a full refund. Items must be unused and in original packaging.",
        keywords: ["return", "refund", "policy", "send back"],
        category: "returns",
        priority: 10,
        isActive: true,
    },
    {
        question: "How can I track my order?",
        answer: "You can track your order by providing your order number. Just say 'track order' followed by your order ID.",
        keywords: ["track", "tracking", "where is my order", "order status"],
        category: "orders",
        priority: 15,
        isActive: true,
    },
    {
        question: "Do you ship internationally?",
        answer: "Yes! We ship to over 50 countries worldwide. International shipping typically takes 7-14 business days.",
        keywords: ["international", "worldwide", "global", "ship abroad"],
        category: "shipping",
        priority: 8,
        isActive: true,
    },
    {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards (Visa, MasterCard, Amex), PayPal, Apple Pay, and Google Pay.",
        keywords: ["payment", "pay", "credit card", "paypal", "methods"],
        category: "payment",
        priority: 9,
        isActive: true,
    },
];

const productKeywordsData = [
    {
        keyword: "red shoes",
        productIds: [], // Will be populated when products exist
        category: "footwear",
        priority: 10,
        isActive: true,
    },
    {
        keyword: "blue jeans",
        productIds: [],
        category: "clothing",
        priority: 10,
        isActive: true,
    },
    {
        keyword: "laptop",
        productIds: [],
        category: "electronics",
        priority: 15,
        isActive: true,
    },
];

async function seedDatabase() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB");

        // Clear existing data
        console.log("Clearing existing chatbot data...");
        await Promise.all([
            ChatbotIntent.deleteMany({}),
            ChatbotResponse.deleteMany({}),
            ChatbotFAQ.deleteMany({}),
            ProductKeyword.deleteMany({}),
        ]);
        console.log("Existing data cleared");

        // Insert new data
        console.log("Inserting intents...");
        await ChatbotIntent.insertMany(intentsData);
        console.log(`Inserted ${intentsData.length} intents`);

        console.log("Inserting responses...");
        await ChatbotResponse.insertMany(responsesData);
        console.log(`Inserted ${responsesData.length} responses`);

        console.log("Inserting FAQs...");
        await ChatbotFAQ.insertMany(faqsData);
        console.log(`Inserted ${faqsData.length} FAQs`);

        console.log("Inserting product keywords...");
        await ProductKeyword.insertMany(productKeywordsData);
        console.log(`Inserted ${productKeywordsData.length} product keywords`);

        console.log("\n✅ Database seeded successfully!");
        console.log("\nSummary:");
        console.log(`- Intents: ${intentsData.length}`);
        console.log(`- Responses: ${responsesData.length}`);
        console.log(`- FAQs: ${faqsData.length}`);
        console.log(`- Product Keywords: ${productKeywordsData.length}`);

        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding database:", error);
        process.exit(1);
    }
}

seedDatabase();
