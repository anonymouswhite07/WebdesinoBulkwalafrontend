import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),
  slug: z.string().optional(),
  image: z
    .any()
    .refine((file) => file instanceof File, "Category image is required"),
  banner: z
    .array(z.any())
    .optional()
    .refine(
      (files) => !files || files.every((f) => f instanceof File),
      "Banner must be valid image files"
    ),
});
