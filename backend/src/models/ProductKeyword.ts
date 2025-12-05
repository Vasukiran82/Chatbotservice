// src/models/ProductKeyword.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IProductKeyword extends Document {
    keyword: string;
    productIds: mongoose.Types.ObjectId[];
    category: string;
    priority: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ProductKeywordSchema = new Schema<IProductKeyword>(
    {
        keyword: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            index: true,
        },
        productIds: {
            type: [Schema.Types.ObjectId],
            ref: "Product",
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

// Compound index for faster lookups
ProductKeywordSchema.index({ keyword: 1, isActive: 1 });
ProductKeywordSchema.index({ category: 1, isActive: 1 });

export const ProductKeyword = mongoose.model<IProductKeyword>(
    "ProductKeyword",
    ProductKeywordSchema
);
