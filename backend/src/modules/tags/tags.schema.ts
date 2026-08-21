import { z } from "zod/v3";

export const createTagSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: "Tag name is required" })
      .min(1, "Tag name cannot be empty")
      .max(50, "Tag name must be at most 50 characters")
      .trim()
      .toLowerCase(),
  }),
});

export type CreateTagBody = z.infer<typeof createTagSchema>["body"];
