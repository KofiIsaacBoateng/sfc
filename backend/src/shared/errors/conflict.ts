import { StatusCodes } from "http-status-codes";
import AppError from "./app-error.js";
import type ErrorCode from "./error-codes.js";

export default class ConflictError extends AppError {
  constructor(
    code: keyof typeof ErrorCode = "CONFLICT",
    message = "Resource conflict: Data already exists",
  ) {
    super(StatusCodes.CONFLICT, code, message);
  }
}
