import { create } from "zustand";
import {
  startOfferService,
  fetchActiveOfferService,
  deleteOfferService,
} from "@/services/offer.service";
import useCartStore from "./cart.store";

export const useOfferStore = create((set, get) => ({
  activeOffer: null,
  isLoading: false,
  timeLeft: 0, // 🕒 in seconds
  timerInterval: null,

  startOffer: async (data) => {
    set({ isLoading: true });
    try {
      const offer = await startOfferService(data);
      set({ activeOffer: offer });
      get().startTimer(offer.expiresAt);
      return { success: true, data: offer };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      set({ isLoading: false });
    }
  },

  fetchActiveOffer: async () => {
    set({ isLoading: true });
    try {
      const offer = await fetchActiveOfferService();
      set({ activeOffer: offer });

      if (offer?.expiresAt) get().startTimer(offer.expiresAt);
      else set({ timeLeft: 0 });

      return { success: true, data: offer };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      set({ isLoading: false });
    }
  },

  startTimer: (expiresAt) => {
    clearInterval(get().timerInterval);

    const interval = setInterval(() => {
      const diff = new Date(expiresAt).getTime() - Date.now();

      if (diff <= 0) {
        clearInterval(interval);
        set({ timeLeft: 0, activeOffer: null, timerInterval: null });

        // 🔥 Auto-refresh cart when offer expires
        useCartStore.getState().fetchCart();
      } else {
        set({ timeLeft: Math.floor(diff / 1000) });
      }
    }, 1000);

    set({ timerInterval: interval });
  },

  deleteOffer: async () => {
    set({ isLoading: true });
    try {
      await deleteOfferService();
      set({ activeOffer: null, timeLeft: 0 });
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      set({ isLoading: false });
    }
  },
}));
