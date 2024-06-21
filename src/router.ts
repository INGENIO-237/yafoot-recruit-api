import { Express, Request, Response } from "express";
import { HTTP } from "./utils/constants/common";
import ApiError from "./utils/errors/errors.base";

export default function router(server: Express) {
  server.get("/healthcheck", (req: Request, res: Response) => {
    throw new ApiError("Test", HTTP.BAD_REQUEST);
  });
}
