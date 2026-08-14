import { z } from "zod";

export const transferSchema = z.object({
  recipientWalletId: z.string().min(1),

  amount: z
    .string()
    .regex(/^\d+$/, "Amount must be a whole number of minor units.")
    .refine((value) => BigInt(value) > 0n, "Amount must be greater than zero."),

  currency: z.enum(["GHS"]),
});
