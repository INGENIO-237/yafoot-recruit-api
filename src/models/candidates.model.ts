import { InferSchemaType, Schema, model } from "mongoose";
import { CITIES, POSITIONS, STRONG_FOOT } from "../utils/constants/candidates";
import { generatePublicId } from "../utils/utilities";

const candidateSchema = new Schema(
  {
    publicId: String,
    firstname: String,
    lastname: {
      type: String,
      required: true,
    },
    image: {
      type: {
        url: {
          type: String,
          required: true,
        },
        publicId: { type: String, required: true },
      },
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    pob: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    clubs: {
      type: [
        {
          start: { type: Number, required: true },
          end: { type: Number, required: true },
          name: { type: String, required: true },
        },
      ],
      default: [],
    },
    height: {
      type: Number,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    practiceLevel: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    strongFoot: {
      type: String,
      enum: STRONG_FOOT,
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
