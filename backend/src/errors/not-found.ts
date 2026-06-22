import { StatusCodes } from "http-status-codes";
import AppError from "./app-error.js";

export default class NotFoundError extends AppError {
  constructor(message = "Requested resource could not be found") {
    super(message, StatusCodes.NOT_FOUND);
  }
}
