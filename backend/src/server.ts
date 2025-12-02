// src/server.ts
import app from "./app";
import { connectDB } from "./config/db";
import { config } from "./config";
import { logger } from "./utils/logger";

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(config.PORT, () => {
      logger.info(`Server running in ${config.NODE_ENV} mode`);
      logger.info(`${config.APP_NAME || "Chatbot"} API is live on http://localhost:${config.PORT}`);
      logger.info(`Health check: http://localhost:${config.PORT}/health`);
    });

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      logger.info(`${signal} received. Shutting down gracefully...`);

      server.close(() => {
        logger.info("HTTP server closed.");
        process.exit(0);
      });

      // Force exit after 10s if not closed
      setTimeout(() => {
        logger.error("Forced shutdown after timeout");
        process.exit(1);
      }, 10_000);
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));

    // Uncaught Exception
    process.on("uncaughtException", (error: Error) => {
      logger.error(
        { err: error, stack: error.stack },
        "Uncaught Exception - Server will exit"
      );
      shutdown("uncaughtException");
    });

    // Unhandled Promise Rejection
    process.on("unhandledRejection", (reason: unknown) => {
      logger.error(
        { reason },
        "Unhandled Promise Rejection - Server will exit"
      );
      shutdown("unhandledRejection");
    });
  } catch (error: unknown) {
    logger.error(
      { err: error instanceof Error ? error : new Error(String(error)) },
      "Failed to start server"
    );
    process.exit(1);
  }
};

startServer();