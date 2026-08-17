import { z, ZodString } from "zod";

export const getUserByIdSchema = z.object({
  id: z.string().uuid("Invalid user ID"),
});

export const createUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name is too long"),
  email: z
    .email({ message: "Invalid email address" })
    .trim()
    .max(255, "Email must be at most 255 characters"),
  currentBalance: z.number().optional().default(0),
});

export const addMoneySchema = z.object({
  id: z.string().uuid("Invalid user ID"),
  amount: z.number().min(1, "Amount must be greater than 0"),
});

export type AddMoneyInput = z.infer<typeof addMoneySchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
