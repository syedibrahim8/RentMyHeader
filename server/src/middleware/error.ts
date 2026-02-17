import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError";
import { ZodError } from "zod";

export function notFound(_req: Request, res: Response) {
  res.status(404).json({ message: "Route not found" });
}

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // 🔥 Handle Zod validation errors first
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Validation error",
      details: err.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  // Handle custom ApiError
  if (err instanceof ApiError) {
    return res.status(err.status).json({
      message: err.message,
      code: err.code,
    });
  }

  // Unknown errors → 500
  console.error("❌ Unexpected Error:", err);

  res.status(500).json({
    message: "Internal Server Error",
  });
}