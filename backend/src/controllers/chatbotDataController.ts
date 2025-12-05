// src/controllers/chatbotDataController.ts
import type { Request, Response } from "express";
import { ChatbotDataService } from "../services/ChatbotDataService";
import { ProductKeyword } from "../models/ProductKeyword";
import { logger } from "../utils/logger";
import { success, error } from "../utils/response";
import { asyncHandler } from "../utils/asyncHandler";
import Fuse from "fuse.js";

/**
 * Get all active intents
 */
export const getIntents = asyncHandler(async (_req: Request, res: Response) => {
    const intents = await ChatbotDataService.getIntents();

    logger.info({ count: intents.length }, "Fetched intents");

    return success(res, { intents }, "Intents retrieved successfully");
});

/**
 * Get all active responses
 */
export const getResponses = asyncHandler(async (_req: Request, res: Response) => {
    const responsesMap = await ChatbotDataService.getResponses();

    // Convert Map to array for JSON response
    const responses = Array.from(responsesMap.values());

    logger.info({ count: responses.length }, "Fetched responses");

    return success(res, { responses }, "Responses retrieved successfully");
});

/**
 * Get all active FAQs
 */
export const getFAQs = asyncHandler(async (_req: Request, res: Response) => {
    const faqs = await ChatbotDataService.getFAQs();

    logger.info({ count: faqs.length }, "Fetched FAQs");

    return success(res, { faqs }, "FAQs retrieved successfully");
});

/**
 * Search products by keywords using fuzzy matching
 */
export const searchProducts = asyncHandler(async (req: Request, res: Response) => {
    const { query } = req.body;

    if (!query || typeof query !== "string") {
        return error(res, "Query is required and must be a string", 400);
    }

    try {
        // Fetch all product keywords
        const productKeywords = await ProductKeyword.find({ isActive: true })
            .populate("productIds")
            .lean();

        if (productKeywords.length === 0) {
            return success(res, { products: [], matches: [] }, "No products found");
        }

        // Use Fuse.js for fuzzy matching
        const fuse = new Fuse(productKeywords, {
            keys: ["keyword", "category"],
            threshold: 0.4,
            includeScore: true,
        });

        const results = fuse.search(query.toLowerCase());

        // Extract matched products
        const matches = results.slice(0, 10).map((result) => ({
            keyword: result.item.keyword,
            category: result.item.category,
            products: result.item.productIds,
            score: result.score,
        }));

        logger.info(
            { query, matchCount: matches.length },
            "Product search completed"
        );

        return success(res, { matches }, "Products found");
    } catch (err) {
        logger.error({ error: err, query }, "Product search failed");
        return error(res, "Failed to search products", 500);
    }
});

/**
 * Search FAQs by query
 */
export const searchFAQ = asyncHandler(async (req: Request, res: Response) => {
    const { query } = req.body;

    if (!query || typeof query !== "string") {
        return error(res, "Query is required and must be a string", 400);
    }

    const faq = await ChatbotDataService.searchFAQ(query);

    if (!faq) {
        return success(res, { faq: null }, "No matching FAQ found");
    }

    logger.info({ query, faqId: faq._id }, "FAQ search completed");

    return success(res, { faq }, "FAQ found");
});

/**
 * Force refresh chatbot data cache
 */
export const refreshCache = asyncHandler(async (_req: Request, res: Response) => {
    await ChatbotDataService.refreshCache();

    logger.info("Cache refreshed manually");

    return success(res, {}, "Cache refreshed successfully");
});
