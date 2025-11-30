import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { categorySchema } from "../../schemas/categorySchema.js";
import { useCategoryStore } from "../../store/category.store.js";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const AddCategoryForm = ({ onSuccess }) => {
  const { addCategory, loading } = useCategoryStore();
  const [previewUrl, setPreviewUrl] = useState("");
  const [bannerPreviewUrls, setBannerPreviewUrls] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      slug: "",
      image: null,
      banner: [],
    },
  });

  const onSubmit = async (data) => {
    try {
      await addCategory(data);
      toast.success("Category added successfully!");
      onSuccess?.();
    } catch (err) {
      toast.error(err.message || "Failed to add category");
    }
  };

  return (
    <Card className="mb-6">
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <Input
            type="text"
            placeholder="Category Name"
            {...register("name")}
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}

          {/* Slug */}
          <Input
            type="text"
            placeholder="Slug (auto-lowercased)"
            {...register("slug")}
          />
          {errors.slug && <p className="text-red-500">{errors.slug.message}</p>}

          {/* Image Upload */}
          <div>
            <label className="block mb-1 text-sm text-gray-600">
              Category Image
            </label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setValue("image", file);
                  setPreviewUrl(URL.createObjectURL(file));
                }
              }}
            />
            {errors.image && (
              <p className="text-red-500">{errors.image.message}</p>
            )}

            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                className="mt-2 h-20 object-cover rounded-md border"
              />
            )}
          </div>

          {/*  Banner Upload (multiple) */}
          <div>
            <label className="block mb-1 text-sm text-gray-600">
              Banner Images
            </label>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files); // all selected files
                setValue("banner", files); // store as array
                setBannerPreviewUrls(
                  files.map((file) => URL.createObjectURL(file))
                );
              }}
            />
            {errors.banner && (
              <p className="text-red-500">{errors.banner.message}</p>
            )}

            <div className="mt-2 flex gap-2 flex-wrap">
              {bannerPreviewUrls.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt="Banner Preview"
                  className="h-20 object-cover rounded-md border"
                />
              ))}
            </div>
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Category"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddCategoryForm;
