import { Service } from "typedi";
import PaymentsService from "../services/payments.services";
import { Request, Response } from "express";
import {
  CreatePayment,
  GetPayment,
  GetPayments,
} from "../schemas/payments.schemas";
import config from "../config";
import { HTTP } from "../utils/constants/common";

@Service()
export default class PaymentsController {
  constructor(private service: PaymentsService) {}

  async initializePayment(
    req: Request<{}, {}, CreatePayment["body"]>,
    res: Response
  ) {
    const { paymentRef, authorization_url } =
      await this.service.initializePayment({
        amount: Number(config.APPLICATION_FEES),
        ...req.body,
      });

    return res.status(HTTP.CREATED).json({
      paymentRef,
      authorization_url,
      message: "Initiated. Confirm the payment on your phone please.",
    });
  }

  async getPayments(
    req: Request<{}, {}, {}, GetPayments["query"]>,
    res: Response
  ) {
    const payments = await this.service.getPayments(req.query);

    return res.status(HTTP.OK).json(payments);
  }

  async getPayment(req: Request<GetPayment["params"]>, res: Response) {
    const payment = await this.service.getPayment({
      reference: req.params.reference,
    });

    return res.status(HTTP.OK).json(payment);
  }
}
