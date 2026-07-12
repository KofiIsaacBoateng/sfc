import { StatusCodes } from "http-status-codes";
import AppError from "./app-error.js";
import type ErrorCode from "./error-codes.js";

export default class UnauthorizedError extends AppError {
  constructor(
    code: keyof typeof ErrorCode,
    message = "Unauthorized: Access token is invalid or expired",
  ) {
    super(StatusCodes.UNAUTHORIZED, code, message);
  }
}
