import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";
import { HTTP } from "../utils/constants/common";
import { parseValidationErrors } from "../utils/errors/errors.utils";

export default function validate(schema: AnyZodObject) {
  return function (req: Request, res: Response, next: NextFunction) {
    try {
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      return next();
    } catch (error) {
      return res.status(HTTP.BAD_REQUEST).json(parseValidationErrors(error));
    }
  };
}
