import { z } from "zod/v3";

export const eventSchema = z.object({
  itle: z
    .string({ required_error: "Title is required" })
    .min(1, "Title cannot be empty")
    .max(255, "Title must be at most 255 characters")
    .trim(),
  description: z.string().max(5000).optional(),
  location: z
    .string()
    .max(255, "Location must be at most 255 characters")
    .optional(),
  event_date: z
    .string({
      required_error: "Event date is required",
    })
    .datetime({ message: "event_date must be a valid ISO 8601 datetime" }),
  type: z.enum(["public", "private"]).default("public"),
  tags_ids: z.array(z.number().int().positive()).optional().default([]),
});
