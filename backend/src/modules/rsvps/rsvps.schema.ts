import { z } from "zod/v3";

export const upsertRsvpSchema = z.object({
  params: z.object({
    eventId: z.coerce.number().int().positive(),
  }),
  body: z.object({
    status: z.enum(["yes", "no", "maybe"], {
      required_error: "Status must be yes, no, or maybe",
    }),
  }),
});

export type UpsertRsvpBody = z.infer<typeof upsertRsvpSchema>["body"];
