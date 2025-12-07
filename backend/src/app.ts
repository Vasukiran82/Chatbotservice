import express, { Request, Response, NextFunction } from "express";
import path from "path";
import cors from "cors";
import { config } from "./config";
import { logger } from "./utils/logger";
import chatRoutes from "./routes/chatRoutes";
import chatbotDataRoutes from "./routes/chatbotDataRoutes";



const app = express();

// CORS
const corsOptions: cors.CorsOptions = {
  origin: config.NODE_ENV === "production" ? config.CLIENT_URL?.split(",") : "*",
  credentials: true,
};
app.use(cors(corsOptions));

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req: Request, _res: Response, next: NextFunction) => {
  logger.info({
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  }, "Incoming request");
  next();
});

// Health check
app.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "OK",
    message: "Chatbot backend is running",
    timestamp: new Date().toISOString(),
    env: config.NODE_ENV,
  });
});

// API Routes
app.use("/api/chat", chatRoutes);
app.use("/api/chatbot", chatbotDataRoutes);

// Serve static frontend files
app.use(express.static(path.join(__dirname, "../../frontend/dist")));

// Handle client-side routing (SPA) - Must be after API routes
app.get("*", (req: Request, res: Response, next: NextFunction) => {
  if (req.originalUrl.startsWith("/api")) {
    return next();
  }
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});


// 404 Handler
app.use("*", (_req: Request, res: Response) => {
  logger.warn({ url: _req.originalUrl }, "Route not found - 404");
  res.status(404).json({
    error: "Not Found",
    message: "The requested endpoint does not exist",
  });
});

// Global Error Handler (final middleware)
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  logger.error(
    {
      error: err.message || "Unknown error",
      stack: err.stack,
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get("User-Agent"),
    },
    "Unhandled exception caught by Express"
  );

  const status = err.status || err.statusCode || 500;

  res.status(status).json({
    error: "Internal Server Error",
    ...(config.NODE_ENV === "development" && {
      message: err.message,
      stack: err.stack?.split("\n"),
    }),
  });
});

export default app;