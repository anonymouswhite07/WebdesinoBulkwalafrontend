import { axiosInstance } from "@/lib/axios";

export const getWishlistService = async () => {
  const res = await axiosInstance.get("/wishlist");
  return res.data.data;
};

export const addToWishlistService = async (productId) => {
  const res = await axiosInstance.post("/wishlist", { productId });
  return res.data.data;
};

export const removeFromWishlistService = async (productId) => {
  const res = await axiosInstance.delete(`/wishlist/${productId}`);
  return res.data.data;
};

export const clearWishlistService = async () => {
  const res = await axiosInstance.delete("/wishlist/clear");
  return res.data.data;
};