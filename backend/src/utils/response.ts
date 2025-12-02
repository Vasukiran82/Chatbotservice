// src/utils/response.ts
import type { Response } from "express";

const isDev = process.env.NODE_ENV !== "production";

export const success = <T>(
  res: Response,
  data: T,
  message = "Success",
  status = 200
) => {
  return res.status(status).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
};

export const error = (
  res: Response,
  message = "Error",
  status = 500,
  details?: any
) => {
  return res.status(status).json({
    success: false,
    message,
    ...(details && isDev && { details }),
    timestamp: new Date().toISOString(),
  });
};