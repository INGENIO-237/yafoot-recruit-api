import { array, nativeEnum, number, object, optional, string, z } from "zod";
import { CITIES, POSITIONS, STRONG_FOOT } from "../utils/constants/candidates";
import { Types } from "mongoose";
import { isValidNumber } from "libphonenumber-js";

export const registerCandidateSchema = object({
  body: object({
    firstname: optional(
      string().min(3, "First Name must be at least 3 chars long")
    ),
    lastname: string({
      required_error: "Last Name is required",
      invalid_type_error: "Last Name must be string",
    }).min(3, "Last Name must be at least 3 chars long"),
    dob: string({ required_error: "Date of birth is required" }).date(
      "Invalid date format"
    ),
    pob: string({
      required_error: "Place of birth is required",
      invalid_type_error: "Place of birth must be a string",
    }),
    address: string({
      required_error: "Address is required",
      invalid_type_error: "Address must be a string",
    }),
    email: string({ required_error: "Email is required" }).email(
      "Invalid email format"
    ),
    clubs: optional(
      array(
        object({
          start: number({ required_error: "Start date is required" }),
          end: number({ required_error: "End date is required" }),
          name: string({ required_error: "Club name is required" }),
        })
      )
    ),
    height: string({ required_error: "Height is required" }),
    weight: string({ required_error: "Weight is required" }),
    practiceLevel: string({ required_error: "Practice level is required" }),
    category: string({required_error: "Category is required"}),
    strongFoot: nativeEnum(STRONG_FOOT),
    city: nativeEnum(CITIES, {
      required_error: "City is required",
      invalid_type_error: "Invalid city",
    }),
    position: nativeEnum(POSITIONS, {
      required_error: "Position is required",
      invalid_type_error: "Invalid position",
    }),
    phone: string({
      required_error: "Phone Number is required",
      invalid_type_error: "Invalid phone number",
    }),
  }).superRefine((data, ctx) => {
    if (!isValidNumber(data.phone))
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid phone number format",
      });

    if(Number.isNaN(Number(data.height))) ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Height must be a number"
    })

    if(Number.isNaN(Number(data.weight))) ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Weight must be a number"
    })
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
