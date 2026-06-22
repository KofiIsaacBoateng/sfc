import { StatusCodes } from "http-status-codes";
import AppError from "./app-error.js";

export default class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized: Access token is invalid or expired") {
    super(message, StatusCodes.UNAUTHORIZED);
  }
}
