import { StatusCodes } from "http-status-codes";
import AppError from "./app-error.js";
import type ErrorCode from "./error-codes.js";

export default class ForbiddenError extends AppError {
  constructor(
    code: keyof typeof ErrorCode = "FORBIDDEN",
    message = "Forbidden: Access to this operation is restricted",
  ) {
    super(StatusCodes.FORBIDDEN, code, message);
  }
}
