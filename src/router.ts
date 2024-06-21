import { Express, Request, Response } from "express";
import { HTTP } from "./utils/constants/common";
import { CandidatesRouter, WaitlistRouter } from "./routes";

export default function router(server: Express) {
  server.get("/healthcheck", (req: Request, res: Response) => {
    return res.sendStatus(HTTP.OK);
  });

  server.use("/api/candidates", CandidatesRouter);
  server.use("/api/waitlist", WaitlistRouter);
}
