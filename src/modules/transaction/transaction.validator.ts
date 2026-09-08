import { z } from "zod";

export const addMoneySchema = z.object({
  id: z.string().uuid("Invalid user ID"),
  amount: z.number().min(1, "Amount must be greater than 0"),
});

export const transferHitorySchema = z.object({
  id: z.string().uuid("Invalid user ID"),
});

export const tranferMoneySchema = z.object({
  from_id: z.string().uuid("Invalid User Id Of Sender."),
  to_id: z.string().uuid("Invalid User Id Of Reciever."),
  amount: z.number().min(1, "Amount must be greated than 0."),
});

export type TransferHitoryInput = z.infer<typeof transferHitorySchema>;
export type TranferMoneyInput = z.infer<typeof tranferMoneySchema>;
export type AddMoneyInput = z.infer<typeof addMoneySchema>;
