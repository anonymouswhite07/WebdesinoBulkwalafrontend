import { z } from "zod";

export const reviewSchema = z.object({
  text: z
    .string()
    .min(3, "Review must be at least 3 characters long")
    .max(500, "Review cannot exceed 500 characters"),
  rating: z
    .number({ invalid_type_error: "Please select a rating" })
    .min(1, "Minimum rating is 1")
    .max(5, "Maximum rating is 5"),
  images: z.any().optional(),
});
