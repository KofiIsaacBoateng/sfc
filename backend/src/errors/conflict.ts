import { StatusCodes } from "http-status-codes";
import AppError from "./app-error.js";

export class ConflictError extends AppError {
  constructor(message = "Resource conflict: Data already exists") {
    super(message, StatusCodes.CONFLICT);
  }
}
