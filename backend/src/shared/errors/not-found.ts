import { StatusCodes } from "http-status-codes";
import AppError from "./app-error.js";
import type ErrorCode from "./error-codes.js";

export default class NotFoundError extends AppError {
  constructor(
    code: keyof typeof ErrorCode,
    message = "Requested resource could not be found",
  ) {
    super(StatusCodes.NOT_FOUND, code, message);
  }
}
