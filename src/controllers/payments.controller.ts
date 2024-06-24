import { Service } from "typedi";
import PaymentsService from "../services/payments.services";
import { Request, Response } from "express";
import { CreatePayment } from "../schemas/payments.schemas";
import config from "../config";
import { HTTP } from "../utils/constants/common";

@Service()
export default class PaymentController {
  constructor(private service: PaymentsService) {}

  async initializePayment(
    req: Request<{}, {}, CreatePayment["body"]>,
    res: Response
  ) {
    const { paymentRef } = await this.service.initializePayment({
      amount: config.APPLICATION_FEES,
      ...req.body,
    });

    return res.status(HTTP.CREATED).json({ paymentRef });
  }
}
