import { z } from "zod/v3";

export const signupSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: "Name is required" })
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be at most 100 characters")
      .trim(),

    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid email address")
      .toLowerCase(),
    password: z
      .string({ required_error: "Password is required" })
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid email address")
      .toLowerCase(),
    password: z.string({ required_error: "Password is required" }).min(1),
  }),
});

export type SignupBody = z.infer<typeof signupSchema>["body"];
export type LoginBody = z.infer<typeof loginSchema>["body"];
