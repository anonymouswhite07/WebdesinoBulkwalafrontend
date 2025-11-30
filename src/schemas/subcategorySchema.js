import { z } from "zod";

export const subcategorySchema = z.object({
  name: z
    .string({ required_error: "Subcategory name is required" })
    .trim()
    .min(2, "Subcategory name must be at least 2 characters"),

  slug: z.string().optional(),

  description: z.string().trim().optional(),

  image: z
    .any()
    .refine((file) => file instanceof File, "Subcategory image is required"),

  category: z
    .string({ required_error: "Parent category is required" })
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid category ObjectId"),
});
