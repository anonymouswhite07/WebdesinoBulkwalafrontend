import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { subcategorySchema } from "../../schemas/subcategorySchema.js";
import { useSubcategoryStore } from "../../store/subcategory.store.js";
import { useCategoryStore } from "../../store/category.store.js";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

const AddSubCategoryForm = ({ onSuccess }) => {
  const { addSubcategory, loading } = useSubcategoryStore();
  const { categories, fetchCategories } = useCategoryStore();

  const [previewUrl, setPreviewUrl] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(subcategorySchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      image: null,
      category: "",
    },
  });

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const onSubmit = async (data) => {
    try {
      await addSubcategory(data);
      toast.success("Subcategory added successfully!");
      onSuccess?.();
    } catch (err) {
      toast.error(err.message || "Failed to add subcategory");
    }
  };

  return (
    <Card className="mb-6">
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <Input
            type="text"
            placeholder="Subcategory Name"
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

          {/* Description */}
          <Input
            type="text"
            placeholder="Description"
            {...register("description")}
          />
          {errors.description && (
            <p className="text-red-500">{errors.description.message}</p>
          )}

          {/* Image Upload */}
          <div>
            <label className="block mb-1 text-sm text-gray-600">
              Subcategory Image
            </label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setValue("image", file); // RHF register file
                  setPreviewUrl(URL.createObjectURL(file)); // preview
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

          {/* Category Dropdown */}
          <div>
            <label className="block mb-1 text-sm text-gray-600">
              Parent Category
            </label>
            <Select
              onValueChange={(value) => setValue("category", value)}
              defaultValue=""
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-red-500">{errors.category.message}</p>
            )}
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Subcategory"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddSubCategoryForm;
