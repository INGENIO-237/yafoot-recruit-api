import { nativeEnum, object, optional, string, z } from "zod";
import { CITIES, POSITIONS } from "../utils/constants/candidates";
import { Types } from "mongoose";

export const registerCandidateSchema = object({
  body: object({
    firstname: optional(
      string().min(3, "First Name must be at least 3 chars long")
    ),
    lastname: string({
      required_error: "Last Name is required",
      invalid_type_error: "Last Name must be string",
    }).min(3, "Last Name must be at least 3 chars long"),
    city: nativeEnum(CITIES, {
      required_error: "City is required",
      invalid_type_error: "Invalid city",
    }),
    position: nativeEnum(POSITIONS, {
      required_error: "Position is required",
      invalid_type_error: "Invalid position",
    }),
  }),
});

export type RegisterCandidate = z.infer<typeof registerCandidateSchema>;

export const getCandidateSchema = object({
  params: object({
    candidateId: string({
      required_error: "Candidate ID is required",
      invalid_type_error: "Invalid candidate ID",
    }),
  }).superRefine((data, ctx) => {
    try {
      new Types.ObjectId(data.candidateId);
    } catch (error) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid candidate ID",
      });
    }
  }),
});

export type GetCandidate = z.infer<typeof getCandidateSchema>;
