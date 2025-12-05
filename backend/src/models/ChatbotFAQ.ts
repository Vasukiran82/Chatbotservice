// src/models/ChatbotFAQ.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IChatbotFAQ extends Document {
    question: string;
    answer: string;
    keywords: string[];
    category: string;
    priority: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ChatbotFAQSchema = new Schema<IChatbotFAQ>(
    {
        question: {
            type: String,
            required: true,
            trim: true,
        },
        answer: {
            type: String,
            required: true,
        },
        keywords: {
            type: [String],
            required: true,
            default: [],
        },
        category: {
            type: String,
            required: true,
            default: "general",
            index: true,
        },
        priority: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
ChatbotFAQSchema.index({ isActive: 1, priority: -1 });
ChatbotFAQSchema.index({ category: 1, isActive: 1 });

export const ChatbotFAQ = mongoose.model<IChatbotFAQ>(
    "ChatbotFAQ",
    ChatbotFAQSchema
);
