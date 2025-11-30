import { axiosInstance } from "@/lib/axios";

export const createOrderService = async (payload) => {
  const res = await axiosInstance.post(`/order/`, payload, {
    withCredentials: true,
  });

  return res.data.data;
};

export const verifyOrderService = async (payload) => {
  const res = await axiosInstance.post(`/order/verify-payment`, payload, {
    withCredentials: true,
  });
  return res.data.data;
};

export const getSingleOrderService = async (orderId) => {
  const res = await axiosInstance.get(`/order/${orderId}`, {
    withCredentials: true,
  });
  return res.data.data;
};

export const getMyOrdersService = async () => {
  const res = await axiosInstance.get("/order/my-orders", {
    withCredentials: true,
  });
  return res.data.data;
};

export const cancelOrderService = async (orderId) => {
  const res = await axiosInstance.post(
    `/order/${orderId}/cancel`,
    {},
    {
      withCredentials: true,
    }
  );
  return res.data.data;
};

// 🔹 Track Order (Delhivery Tracking)
export const trackOrderService = async (orderId) => {
  const res = await axiosInstance.get(`/order/track/${orderId}`, {
    withCredentials: true,
  });
  return res.data.data;
};