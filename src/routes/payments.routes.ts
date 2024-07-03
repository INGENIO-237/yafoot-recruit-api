import "reflect-metadata";

import { Router } from "express";
import Container from "typedi";
import PaymentsController from "../controllers/payments.controller";
import validate from "../middlewares/validate-requests";
import { createPaymentSchema } from "../schemas/payments.schemas";
import { tryCatch } from "../utils/errors/errors.utils";

const PaymentsRouter = Router();
const controller = Container.get(PaymentsController);

PaymentsRouter.post(
  "",
  validate(createPaymentSchema),
  tryCatch(controller.initializePayment.bind(controller))
);

export default PaymentsRouter;
