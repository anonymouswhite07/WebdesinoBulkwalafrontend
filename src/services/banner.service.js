import { axiosInstance } from "@/lib/axios";

export const getAllBannersService = async () => {
  const res = await axiosInstance.get("/banners");
  return res.data.data;
};

export const getActiveBannersService = async () => {
  const res = await axiosInstance.get("/banners/active");
  return res.data.data;
};

export const uploadBannerService = async (formData) => {
  const res = await axiosInstance.post("/banners", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
};

export const toggleBannerService = async (id) => {
  const res = await axiosInstance.put(`/banners/${id}`);
  return res.data.data;
};

export const deleteBannerService = async (id) => {
  const res = await axiosInstance.delete(`/banners/${id}`);
  return res.data.data;
};