// src/models/ChatbotIntent.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IChatbotIntent extends Document {
  name: string;
  keywords: string[];
  boostWords: string[];
  requiredKeywords?: string[];
  minConfidence: number;
  weight: number;
  category: string;
  priority: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ChatbotIntentSchema = new Schema<IChatbotIntent>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    keywords: {
      type: [String],
      required: true,
      default: [],
    },
    boostWords: {
      type: [String],
      default: [],
    },
    requiredKeywords: {
      type: [String],
      default: [],
    },
    minConfidence: {
      type: Number,
      required: true,
      default: 0.4,
      min: 0,
      max: 1,
    },
    weight: {
      type: Number,
      required: true,
      default: 1.0,
      min: 0,
      max: 1,
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
ChatbotIntentSchema.index({ isActive: 1, priority: -1 });

export const ChatbotIntent = mongoose.model<IChatbotIntent>(
  "ChatbotIntent",
  ChatbotIntentSchema
);
