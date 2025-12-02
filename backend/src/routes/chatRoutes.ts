// src/routes/chatRoutes.ts
import { Router } from "express";
import { sendMessage, getHistory } from "../controllers/chatController";

const router = Router();

router.post("/message", sendMessage);
router.get("/history/:sessionId", getHistory);

export default router;