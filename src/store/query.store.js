import { create } from "zustand";
import {
  createQueryService,
  getAllQueriesService,
  getSingleQueryService,
  updateQueryStatusService,
} from "@/services/query.service";

export const useQueryStore = create((set) => ({
  queries: [],
  singleQuery: null,
  loading: false,
  error: null,

  createQuery: async (formData) => {
    set({ loading: true, error: null });
    try {
      const data = await createQueryService(formData);
      set({ loading: false });
      return { success: true, data };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to submit query";
      set({ loading: false, error: msg });
      return { success: false, message: msg };
    }
  },

  fetchQueries: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getAllQueriesService();
      set({ queries: data || [], loading: false });
      return { success: true, data };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to load queries";
      set({ loading: false, error: msg });
      return { success: false, message: msg };
    }
  },

  fetchSingleQuery: async (id) => {
    set({ loading: true, error: null });
    try {
      const data = await getSingleQueryService(id);
      set({ singleQuery: data, loading: false });
      return { success: true, data };
    } catch (err) {
      const msg =
        err.response?.data?.message || "Failed to fetch query details";
      set({ loading: false, error: msg });
      return { success: false, message: msg };
    }
  },

  updateQueryStatus: async (id, status) => {
    set({ loading: true, error: null });
    try {
      const data = await updateQueryStatusService(id, status);
      set((state) => ({
        queries: state.queries.map((q) =>
          q._id === id ? { ...q, status: data.status } : q
        ),
        loading: false,
      }));
      return { success: true, data };
    } catch (err) {
      const msg =
        err.response?.data?.message || "Failed to update query status";
      set({ loading: false, error: msg });
      return { success: false, message: msg };
    }
  },
}));
