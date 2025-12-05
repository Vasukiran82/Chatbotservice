// src/models/ChatbotResponse.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IChatbotResponse extends Document {
    intentName: string;
    responses: string[];
    responseType: "text" | "action" | "product_list" | "order_status";
    metadata?: Record<string, any>;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ChatbotResponseSchema = new Schema<IChatbotResponse>(
    {
        intentName: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        responses: {
            type: [String],
            required: true,
            validate: {
                validator: (v: string[]) => v.length > 0,
                message: "At least one response is required",
            },
        },
        responseType: {
            type: String,
            enum: ["text", "action", "product_list", "order_status"],
            default: "text",
        },
        metadata: {
            type: Schema.Types.Mixed,
            default: {},
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

// Compound index for faster lookups
ChatbotResponseSchema.index({ intentName: 1, isActive: 1 });

export const ChatbotResponse = mongoose.model<IChatbotResponse>(
    "ChatbotResponse",
    ChatbotResponseSchema
);
