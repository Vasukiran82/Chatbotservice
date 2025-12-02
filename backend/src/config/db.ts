// src/config/db.ts
import mongoose from "mongoose";
import dotenv from "dotenv";
import { config } from "./index";
import { logger } from "../utils/logger"; // We'll create this next
dotenv.config();
let isConnected = false;

export const connectDB = async (retryCount = 5, delayMs = 5000): Promise<void> => {
  if (isConnected) {
    logger.info("MongoDB already connected");
    return;
  }

  try {
    const conn = await mongoose.connect(config.MONGO_URI, {
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      bufferCommands: false,
      autoIndex: config.NODE_ENV === "development",
    });

    isConnected = true;
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    logger.error(`MongoDB connection failed (attempt ${6 - retryCount}/5):`, error );

    if (retryCount === 0) {
      logger.error("Max retries reached. Exiting...");
      process.exit(1);
    }

    logger.info(`Retrying connection in ${delayMs / 1000}s...`);
    setTimeout(() => connectDB(retryCount - 1, delayMs), delayMs);
  }
};

// Graceful shutdown
export const disconnectDB = async (): Promise<void> => {
  if (isConnected) {
    await mongoose.disconnect();
    logger.info("MongoDB disconnected gracefully");
  }
};

// Handle process termination
process.on("SIGINT", async () => {
  await disconnectDB();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await disconnectDB();
  process.exit(0);
});

