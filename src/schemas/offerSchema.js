import { z } from "zod";

export const offerSchema = z.object({
  discountPercent: z
    .union([z.string(), z.number()])
    .transform((val) => Number(val))
    .refine(
      (val) => !isNaN(val) && val > 0 && val <= 100,
      "Discount must be between 1–100%"
    ),

  maxDiscountAmount: z
    .union([z.string(), z.number()])
    .transform((val) => Number(val))
    .refine(
      (val) => !isNaN(val) && val >= 1 && val <= 100000,
      "Max discount must be between ₹1 and ₹1000"
    ),
});
