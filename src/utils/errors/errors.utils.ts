import { NextFunction, Request, Response } from "express";
import { BaseError } from "./errors.base";
import logger from "../logger";
import { formatDate } from "../utilities";

export function tryCatch(handler: Function) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      await handler(req, res);
    } catch (error) {
      next(error);
    }
  };
}

export function logError(error: BaseError) {
  const date = new Date().toISOString();
  logger.error(`=========${formatDate(date)}=========`);
  logger.error(error.message);
  logger.error("=========~END=========");
}

export function parseValidationErrors(validationError: any) {
  return [
    ...validationError.errors.map((error: any) => {
      return { message: error.message };
    }),
  ];
}
