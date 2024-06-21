import { InferSchemaType, Schema, model } from "mongoose";

const sessionSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export type ISession = InferSchemaType<typeof sessionSchema>;

const Session = model<ISession>("Session", sessionSchema);

export default Session;
