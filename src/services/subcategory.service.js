import { axiosInstance } from "@/lib/axios";

export const getSubcategories = async () => {
  const res = await axiosInstance.get("/subcategory");
  return res.data.data;
};

export const createSubcategory = async (subcategoryData) => {
  const formData = new FormData();
  formData.append("name", subcategoryData.name);
  formData.append("slug", subcategoryData.slug);
  formData.append("description", subcategoryData.description || "");
  formData.append("category", subcategoryData.category);

  if (subcategoryData.image) {
    formData.append("image", subcategoryData.image);
  }

  const res = await axiosInstance.post("/subcategory", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data.data;
};

// ✅ UPDATE
export const updateSubcategory = async (slug, subcategoryData) => {
  const formData = new FormData();
  if (subcategoryData.name) formData.append("name", subcategoryData.name);
  if (subcategoryData.slug) formData.append("slug", subcategoryData.slug);
  if (subcategoryData.category)
    formData.append("category", subcategoryData.category);
  if (subcategoryData.image)
    formData.append("image", subcategoryData.image);

  const res = await axiosInstance.put(`/subcategory/${slug}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data.data;
};

// ✅ DELETE
export const deleteSubcategory = async (slug) => {
  const res = await axiosInstance.delete(`/subcategory/${slug}`);
  return res.data;
};