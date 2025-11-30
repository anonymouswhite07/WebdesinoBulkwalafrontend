import { create } from "zustand";
import {
  uploadBannerService,
  toggleBannerService,
  getActiveBannersService,
  getAllBannersService,
  deleteBannerService,
} from "@/services/banner.service";

export const useBannerStore = create((set, get) => ({
  banners: [],
  isLoading: false,

  fetchactiveBanners: async () => {
    set({ isLoading: true });
    try {
      const data = await getActiveBannersService();
      set({ banners: data, isLoading: false });
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error("Failed to fetch banners:", err);
      }
      set({ isLoading: false });
    }
  },

  uploadBanner: async (formData) => {
    set({ isLoading: true });
    try {
      const data = await uploadBannerService(formData);
      set({ banners: [data, ...get().banners], isLoading: false });
      return { success: true };
    } catch (err) {
      set({ isLoading: false });
      return { success: false, message: err?.response?.data?.message };
    }
  },

  toggleBanner: async (id) => {
    try {
      const data = await toggleBannerService(id);
      set({
        banners: get().banners.map((b) =>
          b._id === id ? { ...b, isActive: data.isActive } : b
        ),
      });
      return { success: true, data };
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error("Toggle failed:", err);
      }
      return { success: false };
    }
  },

  fetchBanners: async () => {
    set({ isLoading: true });
    try {
      const data = await getAllBannersService();
      set({ banners: data, isLoading: false });
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error("Failed to fetch banners:", err);
      }
      set({ isLoading: false });
    }
  },

  deleteBanner: async (id) => {
    try {
      const data = await deleteBannerService(id);
      set({
        banners: get().banners.filter((b) => b._id !== id),
      });
      return { success: true, data };
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error("Delete failed:", err);
      }
      return { success: false };
    }
  },
}));
