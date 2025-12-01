import { axiosInstance } from "@/lib/axios";

export const getCategories = async () => {
  try {
    const res = await axiosInstance.get("/category");
    // Ensure we return an array, even if the response structure is unexpected
    return Array.isArray(res.data.data) ? res.data.data : [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    // Return empty array on error to prevent app crashes
    return [];
  }
};

export const createCategory = async (categoryData) => {
  const formData = new FormData();
  formData.append("name", categoryData.name);
  if (categoryData.slug) formData.append("slug", categoryData.slug);
  if (categoryData.image) formData.append("image", categoryData.image);

  if (categoryData.banner && categoryData.banner.length > 0) {
    categoryData.banner.forEach((file) => {
      formData.append("banner", file);
    });
  }

  const res = await axiosInstance.post("/category", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
};

// 🆕 UPDATE CATEGORY
export const updateCategory = async (slug, formData) => {
  const res = await axiosInstance.put(`/category/${slug}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
};

// 🆕 DELETE CATEGORY
export const deleteCategory = async (slug) => {
  const res = await axiosInstance.delete(`/category/${slug}`);
  return res.data.data;
};