import { z } from "zod";

export const paymentSchema = z.object({
  amount: z.number().min(1, "Amount must be greater than 0"),
  paymentMode: z.enum(["online", "netbanking", "cod"], {
    required_error: "Please select a payment method",
  }),
});
