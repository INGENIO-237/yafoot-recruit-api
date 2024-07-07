import { InferSchemaType, Schema, Types, model } from "mongoose";
import { PAYMENT_STATUS, PROVIDER } from "../utils/constants/payments";
import config from "../config";

export const paymentSchema = new Schema(
  {
    session: {
      type: Types.ObjectId,
      ref: "Session",
      required: true,
    },
    candidate: {
      type: Types.ObjectId,
      ref: "Candidate",
      required: true,
    },
    amount: {
      type: Number,
      default: config.APPLICATION_FEES ?? 10000,
    },
    status: {
      type: String,
      enum: [PAYMENT_STATUS],
      default: PAYMENT_STATUS.INITIALIZED,
    },
    provider: {
      type: String,
      enum: [PROVIDER],
      required: [true, "Provider is required"],
    },
    reference: {
      type: String,
      required: true,
    },
    card: String
  },
  { timestamps: true }
);

export type IPayment = InferSchemaType<typeof paymentSchema>;

const Payment = model<IPayment>("Payment", paymentSchema);

export default Payment;
