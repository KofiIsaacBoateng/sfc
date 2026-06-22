import type { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

export const notFoundHandler = (
  req: Request,
  res: Response,
  _: NextFunction,
): void => {
  res.status(StatusCodes.NOT_FOUND).json({
    status: "error",
    statusCode: 404,
    message: `The route ${req.method} ${req.originalUrl} does not exist on this network engine`,
  });
};
