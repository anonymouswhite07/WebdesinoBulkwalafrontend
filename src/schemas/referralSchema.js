import { z } from "zod";

export const referralSchema = z.object({
  influencerEmail: z.string().email("Invalid email address"),
  code: z.string().min(2, "Referral code must be at least 2 characters"),
  discountPercent: z
    .union([z.string(), z.number()])
    .transform((val) => Number(val))
    .refine((val) => val > 0 && val <= 100, "Discount must be between 1–100%"),
});
