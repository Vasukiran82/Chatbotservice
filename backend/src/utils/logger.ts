// src/utils/logger.ts
import pino from "pino";

const isProduction = process.env.NODE_ENV === "production";

const logger = pino(
  isProduction
    ? {
        level: "info",
        timestamp: pino.stdTimeFunctions.isoTime,
        formatters: {
          level: (label) => ({ level: label }),
        },
      }
    : {
        level: "debug",
        timestamp: pino.stdTimeFunctions.isoTime,
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "HH:MM:ss",
            ignore: "pid,hostname",
          },
        },
      }
);

export { logger };