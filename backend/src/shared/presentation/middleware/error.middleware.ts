import type { Request, Response, NextFunction } from "express";
import AppError from "../../errors/app-error.js";
import env from "../../config/env.js";
import ErrorCode from "../../errors/error-codes.js";

export function globalErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  _: NextFunction,
): void {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const code = err instanceof AppError ? err.code : ErrorCode.UNKNOWN_ERROR;
  const message = err.message || "Internal Server Error";

  req.log.error(`[SERVER ERROR] ${req.method} ${req.path} -> ${message}`);

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      code,
      stack: env.NODE_ENV === "development" ? err.stack : undefined,
    },
  });
}
