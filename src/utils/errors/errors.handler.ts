import { NextFunction, Request, Response } from "express";
import { BaseError } from "./errors.base";
import { logError } from "./errors.utils";
import { HTTP } from "../constants/common";

export default function errorHandler(
  error: BaseError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logError(error);

  return error.isOperationalError
    ? res.status(error.statusCode).json([{ message: error.message }])
    : res
        .status(HTTP.SERVER_ERROR)
        .json([{ message: "Something went wrong. Retry later." }]);
}
