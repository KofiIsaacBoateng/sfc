import { StatusCodes } from "http-status-codes";
import AppError from "./app-error.js";
import type ErrorCode from "./error-codes.js";

export default class InternalServerError extends AppError {
  constructor(code: keyof typeof ErrorCode, message: string) {
    super(StatusCodes.INTERNAL_SERVER_ERROR, code, message);
  }
}
