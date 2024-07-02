import "reflect-metadata";

import { Router } from "express";
import validate from "../middlewares/validate-requests";
import {
  getCandidateSchema,
  registerCandidateSchema,
} from "../schemas/candidates.schemas";
import Container from "typedi";
import CandidatesController from "../controllers/candidates.controller";
import { tryCatch } from "../utils/errors/errors.utils";

const CandidatesRouter = Router();

const controller = Container.get(CandidatesController);

CandidatesRouter.get("", tryCatch(controller.getCandidates.bind(controller)));

CandidatesRouter.post(
  "",
  validate(registerCandidateSchema),
  tryCatch(controller.registerCandidate.bind(controller))
);

CandidatesRouter.get(
  "/:candidateId",
  validate(getCandidateSchema),
  tryCatch(controller.getCandidate.bind(controller))
);

export default CandidatesRouter;
