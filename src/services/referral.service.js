import { axiosInstance } from "@/lib/axios";

export const createReferralService = async (data) => {
  const res = await axiosInstance.post("/referrals", data);
  return res.data.data;
};

export const fetchReferralsService = async () => {
  const res = await axiosInstance.get("/referrals");
  return res.data.data;
};

export const validateReferralService = async (data) => {
  const res = await axiosInstance.post("/referrals/validate", data);
  return res.data.data;
};

export const deleteReferralService = async (referralId) => {
  const res = await axiosInstance.delete(`/referrals/${referralId}`);
  return res.data.data;
};