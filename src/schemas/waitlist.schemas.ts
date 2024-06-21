import { object, string, z } from "zod";

export const registerToWaitlistSchema = object({
  body: object({
    publicId: string({
      required_error: "Public ID is required",
      invalid_type_error: "Invalid public ID type",
    }),
  }).superRefine((data, ctx) => {
    if (data.publicId.length !== 4) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid public ID format",
      });
    }
  }),
});

export type RegisterToWaitlist = z.infer<typeof registerToWaitlistSchema>