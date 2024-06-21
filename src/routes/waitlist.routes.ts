import "reflect-metadata";

import { Router } from "express";
import Container from "typedi";
import WaitlistController from "../controllers/waitlist.controller";
import validate from "../middlewares/validate-requests";
import { registerToWaitlistSchema } from "../schemas/waitlist.schemas";
import { tryCatch } from "../utils/errors/errors.utils";

const WaitlistRouter = Router();

const controller = Container.get(WaitlistController);

WaitlistRouter.get("", tryCatch(controller.getWaitlist.bind(controller)));
WaitlistRouter.post(
  "",
  validate(registerToWaitlistSchema),
  tryCatch(controller.registerToWaitlist.bind(controller))
);

export default WaitlistRouter;
