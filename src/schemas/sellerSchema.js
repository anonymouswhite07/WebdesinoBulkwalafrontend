import { z } from "zod";

export const SellerApplicationSchema = z.object({
  businessName: z
    .string()
    .trim()
    .min(2, { message: "Business name is required" }),

  gstNumber: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || /^[0-9A-Z]{15}$/.test(val), {
      message: "Invalid GST number format",
    }),

  pickupAddress: z
    .string()
    .trim()
    .min(5, { message: "Pickup address is required" }),

  bankName: z.string().trim().min(2, { message: "Bank name is required" }),

  accountNumber: z
    .string()
    .trim()
    .min(6, { message: "Account number is required" }),

  ifsc: z
    .string()
    .trim()
    .refine((val) => /^[A-Z]{4}0[A-Z0-9]{6}$/.test(val), {
      message: "Invalid IFSC code format",
    }),
});
