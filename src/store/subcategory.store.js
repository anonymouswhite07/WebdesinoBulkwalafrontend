import { create } from "zustand";
import {
  getSubcategories,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
} from "../services/subcategory.service.js";

export const useSubcategoryStore = create((set) => ({
  subcategories: [],
  loading: false,
  error: null,

  fetchSubcategories: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getSubcategories();
      set({ subcategories: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addSubcategory: async (subcategoryData) => {
    set({ loading: true, error: null });
    try {
      const newSubcategory = await createSubcategory(subcategoryData);
      set((state) => ({
        subcategories: [...state.subcategories, newSubcategory],
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },


   // ✅ EDIT
  editSubcategory: async (slug, subcategoryData) => {
    set({ loading: true, error: null });
    try {
      const updatedSub = await updateSubcategory(slug, subcategoryData);
      set((state) => ({
        subcategories: state.subcategories.map((sub) =>
          sub.slug === slug ? updatedSub : sub
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // ✅ DELETE
  removeSubcategory: async (slug) => {
    set({ loading: true, error: null });
    try {
      await deleteSubcategory(slug);
      set((state) => ({
        subcategories: state.subcategories.filter((sub) => sub.slug !== slug),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },



}));
