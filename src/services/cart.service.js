import { axiosInstance } from "@/lib/axios";

export const addToCartService = async (productId, quantity) => {
  const res = await axiosInstance.post("/cart", { productId, quantity });
  return res.data.data;
};

export const fetchCartService = async () => {
  const res = await axiosInstance.get("/cart");
  return res.data.data;
};

export const updateCartItemService = async (productId, quantity) => {
  const res = await axiosInstance.put("/cart", { productId, quantity });
  return res.data.data;
};

export const removeCartItemService = async (productId) => {
  const res = await axiosInstance.delete(`/cart/remove/${productId}`);
  return res.data.data;
};

export const clearCartService = async () => {
  const res = await axiosInstance.delete("/cart/clear-cart");
  return res.data.data;
};

// ✅ Apply coupon
export const applyCouponService = async (couponCode) => {
  const res = await axiosInstance.post("/cart/apply-coupon", {
    couponCode,
  });
  return res.data.data;
};

// ✅ Remove coupon
export const removeCouponService = async () => {
  const res = await axiosInstance.post("/cart/remove-coupon");
  return res.data.data;
};

export const applyReferralService = async (data) => {
  const res = await axiosInstance.post("/cart/apply-referral", data);
  return res.data.data;
};

export const removeReferralService = async () => {
  const res = await axiosInstance.post("/cart/remove-referral");
  return res.data.data;
};