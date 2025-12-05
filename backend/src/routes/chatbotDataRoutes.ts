// src/routes/chatbotDataRoutes.ts
import { Router } from "express";
import {
    getIntents,
    getResponses,
    getFAQs,
    searchProducts,
    searchFAQ,
    refreshCache,
} from "../controllers/chatbotDataController";

const router = Router();

// GET endpoints
router.get("/intents", getIntents);
router.get("/responses", getResponses);
router.get("/faqs", getFAQs);

// POST endpoints
router.post("/search-products", searchProducts);
router.post("/search-faq", searchFAQ);

// Admin endpoint to refresh cache
router.post("/refresh-cache", refreshCache);

export default router;
