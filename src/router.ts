import { Express, Request, Response } from "express";
import { HTTP } from "./utils/constants/common";
import { CandidatesRouter, WaitlistRouter, SessionsRouter } from "./routes";
import PaymentsRouter from "./routes/payments.routes";

export default function router(server: Express) {
  server.get("/healthcheck", (req: Request, res: Response) => {
    return res.sendStatus(HTTP.OK);
  });

  server.use("/api/candidates", CandidatesRouter);
  server.use("/api/waitlist", WaitlistRouter);
  server.use("/api/sessions", SessionsRouter);
  server.use("/api/payments", PaymentsRouter);
}
