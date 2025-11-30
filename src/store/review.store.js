import { create } from "zustand";
import {
  getReviewsService,
  addReviewService,
  deleteReviewService,
  updateReviewService,
} from "@/services/review.service";

export const useReviewStore = create((set) => ({
  reviews: [],
  isLoading: false,
  error: null,

  // ✅ Fetch all reviews for a specific product
  fetchReviews: async (productId) => {
    if (!productId) return;
    set({ isLoading: true, error: null });
    try {
      const data = await getReviewsService(productId);
      set({ reviews: data || [], isLoading: false });
    } catch (error) {
      // Silently handle 401 errors (user not logged in) - this is expected behavior
      if (error.response?.status === 401) {
        set({ isLoading: false });
        return;
      }
      if (process.env.NODE_ENV === "development") {
        console.error("Fetch reviews failed:", error);
      }
      set({ error: error.message, isLoading: false });
    }
  },

  // ✅ Add a new review (with image upload)
  addReview: async (productId, formData) => {
    if (!productId) return;
    set({ isLoading: true, error: null });
    try {
      const newReview = await addReviewService(productId, formData);
      set((state) => ({
        reviews: [newReview, ...state.reviews],
        isLoading: false,
      }));
      return newReview;
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Add review failed:", error);
      }
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // ✅ Delete a review
  deleteReview: async (productId, reviewId) => {
    if (!productId || !reviewId) return;
    set({ isLoading: true, error: null });
    try {
      await deleteReviewService(productId, reviewId);
      set((state) => ({
        reviews: state.reviews.filter((r) => r._id !== reviewId),
        isLoading: false,
      }));
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Delete review failed:", error);
      }
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateReview: async (productId, reviewId, formData) => {
    if (!productId || !reviewId) return;

    set({ isLoading: true, error: null });
    try {
      const updated = await updateReviewService(productId, reviewId, formData);
      set((state) => ({
        reviews: state.reviews.map((r) => (r._id === reviewId ? updated : r)),
        isLoading: false,
      }));
      return updated;
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Update review failed:", error);
      }
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // ✅ Clear all reviews (useful on unmount)
  clearReviews: () => set({ reviews: [] }),
}));
