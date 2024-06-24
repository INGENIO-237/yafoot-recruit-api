import { nativeEnum, object, string, z } from "zod";
import { PROVIDER } from "../utils/constants/payments";

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
  }),
});

export type CreatePayment = z.infer<typeof createPaymentSchema>;
