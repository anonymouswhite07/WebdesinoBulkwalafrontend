import { create } from "zustand";
import {
  createReferralService,
  deleteReferralService,
  fetchReferralsService,
  validateReferralService,
} from "@/services/referral.service";

export const useReferralStore = create((set, get) => ({
  referrals: [],
  isLoading: false,
  isValidating: false,

  fetchReferrals: async () => {
    set({ isLoading: true });
    try {
      const referrals = await fetchReferralsService();
      set({ referrals });
      return { success: true, data: referrals };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      set({ isLoading: false });
    }
  },

  createReferral: async (data) => {
    set({ isLoading: true });
    try {
      const newReferral = await createReferralService(data);
      set((state) => ({ referrals: [newReferral, ...state.referrals] }));
      return { success: true, data: newReferral };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      set({ isLoading: false });
    }
  },

  validateReferral: async (data) => {
    set({ isValidating: true });
    try {
      const result = await validateReferralService(data);
      return { success: true, data: result };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      set({ isValidating: false });
    }
  },

  deleteReferral: async (referralId) => {
    set({ isLoading: true });
    try {
      await deleteReferralService(referralId);
      set((state) => ({
        referrals: state.referrals.filter((r) => r._id !== referralId),
      }));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      set({ isLoading: false });
    }
  },
}));
