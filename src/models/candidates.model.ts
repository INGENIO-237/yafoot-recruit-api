import { InferSchemaType, Schema, model } from "mongoose";
import { CITIES, POSITIONS } from "../utils/constants/candidates";
import { generatePublicId } from "../utils/utilities";

const candidateSchema = new Schema(
  {
    publicId: String,
    firstname: String,
    lastname: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      enum: [CITIES],
    },
    position: {
      type: String,
      enum: [POSITIONS],
    },
    phone: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

candidateSchema.pre("save", function (next) {
  const candidate = this;

  if (candidate.isNew) {
    candidate.publicId = generatePublicId();
  }

  next();
});

export type ICandidate = InferSchemaType<typeof candidateSchema>;

const Candidate = model<ICandidate>("Candidate", candidateSchema);

export default Candidate;
