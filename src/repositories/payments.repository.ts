import { Service } from "typedi";
import Payment from "../models/payments.model";
import { PROVIDER } from "../utils/constants/payments";

@Service()
export default class PaymentRepo {
  async initializePayment({
    session,
    candidate,
    amount,
    provider,
    reference,
  }: {
    session: string;
    candidate: string;
    amount: number;
    provider: PROVIDER;
    reference: string;
  }) {
    const { _id: paymentRef } = await Payment.create({
      session,
      candidate,
      amount,
      provider,
      reference,
    });

    return { paymentRef };
  }
}