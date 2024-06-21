import "reflect-metadata";

import { Router } from "express";
import validate from "../middlewares/validate-requests";
import { createSessionSchema } from "../schemas/sessions.schemas";
import Container from "typedi";
import SessionsController from "../controllers/sessions.controller";

const SessionsRouter = Router();
const controller = Container.get(SessionsController);

SessionsRouter.get("", controller.getSessions.bind(controller));

SessionsRouter.post(
  "",
  validate(createSessionSchema),
  controller.createSession.bind(controller)
);

export default SessionsRouter;
