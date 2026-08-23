import { z } from "zod";

const userSchema = {
  name: z.string().trim().min(2, "add a bigger name"),
  email: z.string().trim().toLowerCase().email("Invalid email id."),
  password: z.string().trim().min(6, "Minimum 6 characters."),
};

export const registrationSchema = z.object({
  name: userSchema.name,

  email: userSchema.email,

  password: userSchema.password,
});

export const loginSchema = z.object({
  email: userSchema.email,

  password: userSchema.password,
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegistartionInput = z.infer<typeof registrationSchema>;
