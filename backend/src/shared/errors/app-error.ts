import ErrorCode from "./error-codes.js";

export default class AppError extends Error {
  public readonly isOperational: boolean;

  constructor(
    public readonly statusCode: number,
    public readonly code: keyof typeof ErrorCode,
    message: string,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
