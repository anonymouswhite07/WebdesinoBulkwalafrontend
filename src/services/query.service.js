import { axiosInstance } from "@/lib/axios";

export const createQueryService = async (data) => {
  const res = await axiosInstance.post("/api/query", data);
  return res.data.data;
};

export const getAllQueriesService = async () => {
  const res = await axiosInstance.get("/api/query");
  return res.data.data;
};

export const getSingleQueryService = async (id) => {
  const res = await axiosInstance.get(`/api/query/${id}`);
  return res.data.data;
};

export const updateQueryStatusService = async (id, status) => {
  const res = await axiosInstance.patch(`/api/query/${id}`, { status });
  return res.data.data;
};
