import { StatusCodes } from "http-status-codes";
import AppError from "./app-error.js";

export default class BadRequestError extends AppError {
  constructor(message = "Bad Request: Invalid payload inputs supplied") {
    super(message, StatusCodes.BAD_REQUEST);
  }
}
