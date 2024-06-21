import { HTTP } from "../constants/common";

export class BaseError extends Error {
  constructor(
    name: string,
    message: string,
    public statusCode: HTTP,
    public isOperationalError: boolean
  ) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
    this.isOperationalError = isOperationalError;

    Error.captureStackTrace(this);
  }
}

export default class ApiError extends BaseError {
  constructor(message: string, statusCode: HTTP) {
    super("ApiError", message, statusCode, true);
  }
}
