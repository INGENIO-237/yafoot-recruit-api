import { Service } from "typedi";
import Payment from "../models/payments.model";
import { PAYMENT_STATUS, PROVIDER } from "../utils/constants/payments";
import { Types } from "mongoose";
import { GetPayments } from "../schemas/payments.schemas";

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

  async updatePayment({
    reference,
    status,
    card,
  }: {
    reference: string;
    status?: PAYMENT_STATUS;
    card?: string;
  }) {
    await Payment.findOneAndUpdate({ reference }, { status, card });
  }

  async getPayments(query?: GetPayments["query"]) {
    return await (query && query.session
      ? Payment.find({ session: new Types.ObjectId(query.session) })
      : Payment.find()
    )
      .select("status amount updatedAt reference card")
      .populate("candidate");
  }

  async getPayment({ reference, id }: { reference?: string; id?: string }) {
    return await Payment.findOne({
      $or: [{ reference }, { _id: new Types.ObjectId(id) }],
    })
      .select("status amount reference card")
      .populate("candidate");
  }
}
