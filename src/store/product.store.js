import {
  createProduct,
  getProducts,
  deleteProduct,
  updateProduct,
  getProduct,
} from "@/services/product.service";
import { create } from "zustand";

export const useProductStore = create((set) => ({
  singleProduct: null,
  products: [],
  loading: false,
  error: null,
  total: 0,
  page: 1,
  limit: 12,
  filter: {},

  fetchProducts: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const data = await getProducts(params);
      set({
        products: data.products,
        total: data.total,
        page: data.page,
        limit: data.limit,
        loading: false,
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addProduct: async (productData) => {
    set({ loading: true, error: null });
    try {
      const newProduct = await createProduct(productData);
      set((state) => ({
        products: Array.isArray(state.products)
          ? [...state.products, newProduct]
          : [...(state.products?.products || []), newProduct],
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  editProduct: async (slug, productData) => {
    set({ loading: true, error: null });
    try {
      // ✅ Directly pass FormData if already provided
      let formData;

      if (productData instanceof FormData) {
        formData = productData;
      } else {
        formData = new FormData();
        Object.entries(productData).forEach(([key, value]) => {
          if (key === "images" && value?.length > 0) {
            Array.from(value).forEach((img) => formData.append("images", img));
          } else if (Array.isArray(value)) {
            value.forEach((v) => formData.append(key, v));
          } else if (value !== undefined && value !== null) {
            formData.append(key, value);
          }
        });
      }

      // ✅ Add slug & sku checks
      if (productData.slug) formData.append("slug", productData.slug);
      if (productData.sku) formData.append("sku", productData.sku);

      const updatedProduct = await updateProduct(slug, formData);

      set((state) => {
        const updatedList = Array.isArray(state.products)
          ? state.products.map((p) => (p.slug === slug ? updatedProduct : p))
          : (state.products?.products || []).map((p) =>
              p.slug === slug ? updatedProduct : p
            );

        return { products: updatedList, loading: false };
      });
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Update failed:", error);
      }
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  deleteProduct: async (slug) => {
    set({ loading: true, error: null });
    try {
      await deleteProduct(slug);
      set((state) => {
        const updatedList = Array.isArray(state.products)
          ? state.products.filter((product) => product.slug !== slug)
          : (state.products?.products || []).filter(
              (product) => product.slug !== slug
            );
        return { products: updatedList, loading: false };
      });
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Delete failed:", error);
      }
      set({ error: error.message, loading: false });
    }
  },

  getProductBySlug: async (slug) => {
    set({ loading: true, error: null });
    try {
      const product = await getProduct(slug);
      set({ singleProduct: product, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
}));
