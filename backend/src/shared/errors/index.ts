import BadRequestError from "./bad-request.js";
import ConflictError from "./conflict.js";
import ErrorCode from "./error-codes.js";
import ForbiddenError from "./forbidden.js";
import InternalServerError from "./internal-server.js";
import NotFoundError from "./not-found.js";
import UnauthorizedError from "./unauthorized.js";

class InvalidPhoneNumber extends BadRequestError {
  constructor() {
    super(ErrorCode.INVALID_PHONE_NUMBER, "Invalid phone number!");
  }
}

export {
  BadRequestError,
  ConflictError,
  ErrorCode,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,

  // domain errors
  InvalidPhoneNumber,
};
