import { axiosInstance } from "@/lib/axios";

export const createCouponService = async (data) => {
  const res = await axiosInstance.post("/coupons", data);
  return res.data.data;
};

export const fetchCouponsService = async () => {
  const res = await axiosInstance.get("/coupons");
  return res.data.data;
};

export const deleteCouponService = async (couponId) => {
  const res = await axiosInstance.delete(`/coupons/${couponId}`);
  return res.data.data;
};