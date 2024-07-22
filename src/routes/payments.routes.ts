import "reflect-metadata";

import { Router } from "express";
import Container from "typedi";
import PaymentsController from "../controllers/payments.controller";
import validate from "../middlewares/validate-requests";
import { createPaymentSchema, getPaymentSchema } from "../schemas/payments.schemas";
import { tryCatch } from "../utils/errors/errors.utils";

const PaymentsRouter = Router();
const controller = Container.get(PaymentsController);

PaymentsRouter.post(
  "",
  validate(createPaymentSchema),
  tryCatch(controller.initializePayment.bind(controller))
);

PaymentsRouter.get(
  "",
  tryCatch(controller.getPayments.bind(controller))
);

PaymentsRouter.get(
  "/:reference",
  validate(getPaymentSchema),
  tryCatch(controller.getPayment.bind(controller))
);

export default PaymentsRouter;
