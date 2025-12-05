// src/services/ChatbotDataService.ts
import Fuse from "fuse.js";
import { ChatbotIntent, IChatbotIntent } from "../models/ChatbotIntent";
import { ChatbotResponse, IChatbotResponse } from "../models/ChatbotResponse";
import { ChatbotFAQ, IChatbotFAQ } from "../models/ChatbotFAQ";
import { logger } from "../utils/logger";

interface CachedData {
    intents: IChatbotIntent[];
    responses: Map<string, IChatbotResponse>;
    faqs: IChatbotFAQ[];
    intentFuse: Fuse<IChatbotIntent> | null;
    faqFuse: Fuse<IChatbotFAQ> | null;
    lastUpdated: Date;
}

class ChatbotDataServiceClass {
    private cache: CachedData = {
        intents: [],
        responses: new Map(),
        faqs: [],
        intentFuse: null,
        faqFuse: null,
        lastUpdated: new Date(0),
    };

    private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes
    private isLoading = false;

    /**
     * Load all intents from MongoDB and build Fuse index
     */
    async loadIntents(): Promise<IChatbotIntent[]> {
        try {
            const intents = await ChatbotIntent.find({ isActive: true })
                .sort({ priority: -1 })
                .lean();

            this.cache.intents = intents;

            // Build Fuse index for fuzzy matching
            const fuseOptions = {
                includeScore: true,
                keys: [
                    { name: "keywords", weight: 0.7 },
                    { name: "boostWords", weight: 0.3 },
                ],
                threshold: 0.6,
                ignoreLocation: true,
            };

            this.cache.intentFuse = new Fuse(intents, fuseOptions);

            logger.info({ count: intents.length }, "Loaded intents from database");
            return intents;
        } catch (error) {
            logger.error({ error }, "Failed to load intents");
            throw error;
        }
    }

    /**
     * Load all responses from MongoDB and index by intent name
     */
    async loadResponses(): Promise<Map<string, IChatbotResponse>> {
        try {
            const responses = await ChatbotResponse.find({ isActive: true }).lean();

            const responseMap = new Map<string, IChatbotResponse>();
            responses.forEach((response) => {
                responseMap.set(response.intentName, response);
            });

            this.cache.responses = responseMap;

            logger.info({ count: responses.length }, "Loaded responses from database");
            return responseMap;
        } catch (error) {
            logger.error({ error }, "Failed to load responses");
            throw error;
        }
    }

    /**
     * Load all FAQs from MongoDB and build Fuse index
     */
    async loadFAQs(): Promise<IChatbotFAQ[]> {
        try {
            const faqs = await ChatbotFAQ.find({ isActive: true })
                .sort({ priority: -1 })
                .lean();

            this.cache.faqs = faqs;

            // Build Fuse index for FAQ search
            const fuseOptions = {
                includeScore: true,
                keys: [
                    { name: "question", weight: 0.6 },
                    { name: "keywords", weight: 0.4 },
                ],
                threshold: 0.5,
                ignoreLocation: true,
            };

            this.cache.faqFuse = new Fuse(faqs, fuseOptions);

            logger.info({ count: faqs.length }, "Loaded FAQs from database");
            return faqs;
        } catch (error) {
            logger.error({ error }, "Failed to load FAQs");
            throw error;
        }
    }

    /**
     * Refresh all cached data
     */
    async refreshCache(): Promise<void> {
        if (this.isLoading) {
            logger.warn("Cache refresh already in progress");
            return;
        }

        this.isLoading = true;
        try {
            await Promise.all([
                this.loadIntents(),
                this.loadResponses(),
                this.loadFAQs(),
            ]);

            this.cache.lastUpdated = new Date();
            logger.info("Chatbot data cache refreshed successfully");
        } catch (error) {
            logger.error({ error }, "Failed to refresh cache");
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Get cached intents (auto-refresh if stale)
     */
    async getIntents(): Promise<IChatbotIntent[]> {
        if (this.isCacheStale() || this.cache.intents.length === 0) {
            await this.refreshCache();
        }
        return this.cache.intents;
    }

    /**
     * Get cached responses (auto-refresh if stale)
     */
    async getResponses(): Promise<Map<string, IChatbotResponse>> {
        if (this.isCacheStale() || this.cache.responses.size === 0) {
            await this.refreshCache();
        }
        return this.cache.responses;
    }

    /**
     * Get cached FAQs (auto-refresh if stale)
     */
    async getFAQs(): Promise<IChatbotFAQ[]> {
        if (this.isCacheStale() || this.cache.faqs.length === 0) {
            await this.refreshCache();
        }
        return this.cache.faqs;
    }

    /**
     * Get Fuse instance for intent matching
     */
    async getIntentFuse(): Promise<Fuse<IChatbotIntent>> {
        if (this.isCacheStale() || !this.cache.intentFuse) {
            await this.refreshCache();
        }
        if (!this.cache.intentFuse) {
            throw new Error("Intent Fuse index not initialized");
        }
        return this.cache.intentFuse;
    }

    /**
     * Search FAQs using fuzzy matching
     */
    async searchFAQ(query: string): Promise<IChatbotFAQ | null> {
        if (this.isCacheStale() || !this.cache.faqFuse) {
            await this.refreshCache();
        }

        if (!this.cache.faqFuse) {
            return null;
        }

        const results = this.cache.faqFuse.search(query);

        if (results.length > 0 && results[0].score && results[0].score < 0.5) {
            return results[0].item;
        }

        return null;
    }

    /**
     * Get response for a specific intent
     */
    async getResponseForIntent(intentName: string): Promise<string[]> {
        const responses = await this.getResponses();
        const response = responses.get(intentName);

        if (!response || !response.responses || response.responses.length === 0) {
            logger.warn({ intentName }, "No responses found for intent");
            return ["I'm not sure how to respond to that."];
        }

        return response.responses;
    }

    /**
     * Get random response for an intent
     */
    async getRandomResponse(intentName: string): Promise<string> {
        const responses = await this.getResponseForIntent(intentName);
        const randomIndex = Math.floor(Math.random() * responses.length);
        return responses[randomIndex];
    }

    /**
     * Check if cache is stale
     */
    private isCacheStale(): boolean {
        const now = new Date();
        const timeSinceUpdate = now.getTime() - this.cache.lastUpdated.getTime();
        return timeSinceUpdate > this.CACHE_TTL;
    }

    /**
     * Initialize cache on startup
     */
    async initialize(): Promise<void> {
        logger.info("Initializing ChatbotDataService...");
        await this.refreshCache();
        logger.info("ChatbotDataService initialized successfully");
    }
}

export const ChatbotDataService = new ChatbotDataServiceClass();
