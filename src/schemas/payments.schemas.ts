import { nativeEnum, object, string, z } from "zod";
import { PROVIDER } from "../utils/constants/payments";
import { isValidNumber } from "libphonenumber-js";
import { Types } from "mongoose";

export const createPaymentSchema = object({
  body: object({
    publicId: string({
      required_error: "Public ID is required",
      invalid_type_error: "Invalid public ID type",
    }),
    provider: nativeEnum(PROVIDER, { required_error: "Provider is required" }),
    session: string({
      required_error: "Session is required",
      invalid_type_error: "Invalid session type",
    }),
    phone: string({
      required_error: "Phone Number is required",
      invalid_type_error: "Invalid phone number",
    }),
  }).superRefine((data, ctx) => {
    if (data.publicId.length !== 4) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid public ID format",
      });
    }

    if (!isValidNumber(data.phone))
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid phone number format",
      });

    // Verify if session (the ID of the session can be parsed into an ObjectId type or not)
    try {
      new Types.ObjectId(data.session);
    } catch (error) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid session format",
      });
    }
  }),
});

export type CreatePayment = z.infer<typeof createPaymentSchema>;
