import { z } from "zod/v3";

export const createEventSchema = z.object({
  body: z.object({
    title: z
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
  }),
});

export const updateEventSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive("Event Id must be positive integer"),
  }),
  body: z.object({
    title: z.string().min(1).max(255).trim().optional(),
    description: z.string().max(5000).optional(),
    location: z.string().max(255).optional(),
    event_date: z.string().datetime().optional(),
    type: z.enum(["public", "private"]).optional(),
    tag_ids: z.array(z.number().int().positive()).optional(),
  }),
});

export const eventParamsSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive("Event ID must be a positive integer"),
  }),
});

export const listEventsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
    type: z.enum(["public", "private"]).optional(),
    tags: z.string().optional(), // should be comma seperated for the tag names: "Birthday,Conference"
    search: z.string().max(200).optional(),
    sortBy: z.enum(["event_date", "created_at", "title"]).default("event_date"),
    order: z.enum(["asc", "desc"]).default("asc"),
  }),
});

export type CreateEventBody = z.infer<typeof createEventSchema>["body"];
export type UpdateEventBody = z.infer<typeof updateEventSchema>["body"];
export type ListEventsQuery = z.infer<typeof listEventsSchema>["query"];
