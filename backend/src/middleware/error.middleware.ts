import type { Request, Response, NextFunction } from "express";
import AppError from "../errors/app-error.js";

export function globalErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  _: NextFunction,
): void {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err.message || "Internal Server Error";

  console.error(`❌ [SERVER ERROR] ${req.method} ${req.path} -> ${message}`);
  if (process.env["NODE_ENV"] !== "production") {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    status: "error",
    statusCode,
    message,
    stack: process.env["NODE_ENV"] === "development" ? err.stack : undefined,
  });
}
