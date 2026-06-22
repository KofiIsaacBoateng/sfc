import { StatusCodes } from "http-status-codes";
import AppError from "./app-error.js";

export default class ForbiddenError extends AppError {
  constructor(message = "Forbidden: Access to this operation is restricted") {
    super(message, StatusCodes.FORBIDDEN);
  }
}
