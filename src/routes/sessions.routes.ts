import "reflect-metadata";

import { Router } from "express";
import validate from "../middlewares/validate-requests";
import { createSessionSchema } from "../schemas/sessions.schemas";
import Container from "typedi";
import SessionsController from "../controllers/sessions.controller";
import { tryCatch } from "../utils/errors/errors.utils";

const SessionsRouter = Router();
const controller = Container.get(SessionsController);

SessionsRouter.get("", tryCatch(controller.getSessions.bind(controller)));

SessionsRouter.post(
  "",
  validate(createSessionSchema),
  tryCatch(controller.createSession.bind(controller))
);

SessionsRouter.get(
  "/latest",
  tryCatch(controller.getLatestSession.bind(controller))
);

export default SessionsRouter;
