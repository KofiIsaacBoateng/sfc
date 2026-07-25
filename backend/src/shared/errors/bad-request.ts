import { StatusCodes } from "http-status-codes";
import AppError from "./app-error.js";
import type ErrorCode from "./error-codes.js";

export default class BadRequestError extends AppError {
  constructor(
    code: keyof typeof ErrorCode = "BAD_REQUEST",
    message = "Bad Request: Invalid payload inputs supplied",
  ) {
    super(StatusCodes.BAD_REQUEST, code, message);
  }
}
