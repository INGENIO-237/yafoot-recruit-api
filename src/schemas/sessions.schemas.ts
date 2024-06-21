import { object, string, z } from "zod";

export const createSessionSchema = object({
  body: object({
    date: string({ required_error: "Session starting date is required" }).date(
      "Invalid date format"
    ),
  }),
});

export type CreateSession = z.infer<typeof createSessionSchema>;
