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
import multer from "multer";
import { storage } from "../utils/multer";
import uploadCandidateImage from "../middlewares/cloudinary.upload";

const upload = multer({ storage });

const CandidatesRouter = Router();

const controller = Container.get(CandidatesController);

CandidatesRouter.get("", tryCatch(controller.getCandidates.bind(controller)));

CandidatesRouter.post(
  "",
  upload.single("image"),
  (req, res, next) => {
    if (req.body.clubs) {
      req.body.clubs = JSON.parse(req.body.clubs);
    }

    next();
  },
  validate(registerCandidateSchema),
  uploadCandidateImage,
  tryCatch(controller.registerCandidate.bind(controller))
);

CandidatesRouter.get(
  "/:candidateId",
  validate(getCandidateSchema),
  tryCatch(controller.getCandidate.bind(controller))
);

export default CandidatesRouter;
