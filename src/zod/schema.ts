import { z } from "zod";

export const signUpSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8, "Password should have atleast 8 characters"),
    name: z
      .string()
      .min(3, "Name should have atleast 3 characters")
      .max(50, "Name should have atmost 50 character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export type signUpSchema = z.infer<typeof signUpSchema>;
