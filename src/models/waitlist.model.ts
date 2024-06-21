import { InferSchemaType, Schema, Types, model } from "mongoose";

const waitlistSchema = new Schema(
  {
    candidate: {
      type: Types.ObjectId,
      ref: "Candidate",
    },
  },
  { timestamps: true }
);

export type IWaitlist = InferSchemaType<typeof waitlistSchema>;

const Waitlist = model<IWaitlist>("Waitlist", waitlistSchema);

export default Waitlist;
