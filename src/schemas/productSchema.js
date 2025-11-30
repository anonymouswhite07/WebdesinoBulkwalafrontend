import { z } from "zod";

export const productSchema = z.object({
  title: z.string().min(2, "Title is required"),

  slug: z.string().optional(),

  description: z.string().min(5, "Description is required"),

  images: z
    .any()
    .refine(
      (files) => files && files.length > 0,
      "At least one image is required"
    ),

  video: z
    .any()
    .refine((file) => !file || file instanceof File, "Invalid video file")
    .refine(
      (file) => {
        if (!file) return true; // Video is optional
        const validTypes = [
          'video/mp4',
          'video/quicktime', // MOV
          'video/webm',
          'video/avi',
          'video/x-msvideo',
          'video/x-m4v'
        ];
        return validTypes.includes(file.type);
      },
      "Unsupported video format. Please use MP4, MOV, WebM, or AVI files."
    )
    .refine(
      (file) => {
        if (!file) return true; // Video is optional
        const maxSize = 150 * 1024 * 1024; // 150MB
        return file.size <= maxSize;
      },
      "Video size must not exceed 150MB"
    )
    .optional(),

  price: z
    .union([z.string(), z.number()])
    .transform((val) => Number(val))
    .refine((val) => val > 0, "Price must be greater than 0"),

  discountPrice: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => (val === undefined ? undefined : Number(val)))
    .refine((val) => val === undefined || val >= 0, {
      message: "Discount price must be >= 0",
    }),

  stock: z
    .union([z.string(), z.number()])
    .transform((val) => Number(val))
    .refine((val) => val >= 0, "Stock must be >= 0"),

  category: z.string().min(1, "Category is required"),
  subcategory: z.string().min(1, "Subcategory is required"),

  tags: z
    .union([z.string(), z.array(z.string())])
    .transform((val) =>
      Array.isArray(val)
        ? val
        : val
        ? val
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : []
    )
    .optional(),

  color: z
    .union([z.string(), z.array(z.string())])
    .transform((val) =>
      Array.isArray(val)
        ? val
        : val
        ? val
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean)
        : []
    )
    .optional(),

  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),

  sku: z.string().trim().optional(),
  genericName: z.string().optional(),
  countryOfOrigin: z.enum(["India", "China"]).default("India"),
  manufacturerName: z.string().optional(),
  gstSlab: z
    .union([z.string(), z.number()])
    .transform((val) => Number(String(val).replace("%", "")) || 0)
    .refine((val) => [0, 5, 12, 18, 28].includes(val), {
      message: "GST must be 0, 5, 12, 18, or 28%",
    }),
});