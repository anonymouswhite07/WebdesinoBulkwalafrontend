import { z } from "zod";

export const bannerSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  ctaLink: z.string().trim().url("CTA link must be a valid URL").optional(),
  images: z
    .any()
    .refine(
      (files) => files && files.length > 0,
      "At least one image is required"
    )
    .refine(
      (files) => files.length <= 3,
      "You can upload a maximum of 3 images"
    ),
});
