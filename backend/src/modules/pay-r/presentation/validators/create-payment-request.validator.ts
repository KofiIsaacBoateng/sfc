import { z } from "zod";

export const createPaymentRequestSchema = z.object({
  amount: z
    .string()
    .regex(/^\d+$/, "Amount must be a whole number of minor units.")
    .refine((value) => BigInt(value) > 0n, "Amount must be greater than zero."),

  currency: z.enum(["GHS"]),

  expiresAt: z.iso.datetime(),
});
