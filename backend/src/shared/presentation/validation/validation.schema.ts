import type { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";
import { ErrorCode } from "../../errors/index.js";
import { logger } from "../../logger/logger.js";
import BadRequestError from "../../errors/bad-request.js";

export const validateSchema =
  <T>(schema: ZodType<T>) =>
  (req: Request, _: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      logger.warn({
        message: "Validation Failed",
        errors: result.error.issues,
      });
      throw new BadRequestError(
        ErrorCode.VALIDATION_ERROR,
        "Invalid request body!",
      );
    }
    next();
  };
