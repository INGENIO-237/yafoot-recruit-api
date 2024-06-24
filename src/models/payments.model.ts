import { InferSchemaType, Schema, Types, model } from "mongoose";
import { PAYMENT_STATUS, PROVIDER } from "../utils/constants/payments";

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
      required: true,
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
  },
  { timestamps: true }
);

export type IPayment = InferSchemaType<typeof paymentSchema>;

const Payment = model<IPayment>("Payment", paymentSchema);

export default Payment;
