import { create } from "zustand";
import { getCategories, createCategory ,updateCategory,deleteCategory } from "../services/category.service.js";

export const useCategoryStore = create((set) => ({
  categories: [],
  loading: false,
  error: null,

  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getCategories();
      set({ categories: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addCategory: async (categoryData) => {
    set({ loading: true, error: null });
    try {
      const newCategory = await createCategory(categoryData);
      set((state) => ({
        categories: [...state.categories, newCategory],
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },


  editCategory:async(slug,categoryData)=>{
     set({ loading: true, error: null });
    try {
      const updated = await updateCategory(slug, categoryData);
      set((state) => ({
        categories: state.categories.map((cat) =>
          cat.slug === slug ? updated : cat
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },


  
  removeCategory: async (slug) => {
    set({ loading: true, error: null });
    try {
      await deleteCategory(slug);
      set((state) => ({
        categories: state.categories.filter((cat) => cat.slug !== slug),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },


}));
