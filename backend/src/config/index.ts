import dotenv from "dotenv";
import { z } from "zod";

dotenv.config(); // Load backend/.env

// Schema validation
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(5001),

  // IMPORTANT: Must match backend/.env key
  MONGO_URI: z.string().min(1, "MONGO_URI is required"),

  JWT_SECRET: z.string().optional(),
  LOG_LEVEL: z.enum(["error", "warn", "info", "debug"]).default("debug"),
  APP_NAME: z.string().default("Universal Chatbot Service"),
  CLIENT_URL: z.string().url().optional(),
});

export const config = envSchema.parse(process.env);

// Debug logs
if (config.NODE_ENV !== "production") {
  console.log("Configuration loaded:");
  console.log({
    NODE_ENV: config.NODE_ENV,
    PORT: config.PORT,
    APP_NAME: config.APP_NAME,
    MONGO_URI: config.MONGO_URI ? "Loaded ✓" : "Missing!",
    LOG_LEVEL: config.LOG_LEVEL,
  });
}
