import {
  addToCartService,
  applyCouponService,
  applyReferralService,
  clearCartService,
  fetchCartService,
  removeCartItemService,
  removeCouponService,
  removeReferralService,
  updateCartItemService,
} from "@/services/cart.service";
import { getProducts } from "@/services/product.service";
import { create } from "zustand";
import useAuthStore from "./auth.store";

// ✅ Guest cart localStorage key
const GUEST_CART_KEY = "guest_cart";

// ✅ Helper functions for guest cart
const getGuestCart = () => {
  try {
    const cart = localStorage.getItem(GUEST_CART_KEY);
    return cart ? JSON.parse(cart) : { items: [] };
  } catch {
    return { items: [] };
  }
};

const saveGuestCart = (cart) => {
  try {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error saving guest cart:", error);
    }
  }
};

const clearGuestCart = () => {
  try {
    localStorage.removeItem(GUEST_CART_KEY);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error clearing guest cart:", error);
    }
  }
};

const useCartStore = create((set, get) => ({
  cart: { items: [] },
  cartInitialized: false,
  itemsPrice: 0,
  shippingPrice: 0,
  totalPrice: 0,
  totalItems: 0,
  discount: 0,
  couponApplied: false,
  appliedCouponCode: "",
  referralApplied: false,
  referralCode: null,
  referralDiscount: 0,
  isLoading: true,
  isUpdating: false,
  couponError: "",
  buyNowProductId: null,

  // ✅ Load guest cart on initialization
  loadGuestCart: () => {
    const { user } = useAuthStore.getState();
    if (!user || !user._id) {
      const guestCart = getGuestCart();
      if (guestCart.items && guestCart.items.length > 0) {
        set({ cart: guestCart, isLoading: false, cartInitialized: true });
      }
    }
  },

  // ✅ Fetch cart (backend for logged in, localStorage for guests)
  fetchCart: async () => {
    const { user } = useAuthStore.getState();

    set({ isLoading: true });

    // ✅ If not logged in, load from localStorage and normalize guest cart
    if (!user || !user._id) {
      const guestCart = getGuestCart();

      // ✅ If guest cart has items, fetch product details for each
      if (guestCart.items && guestCart.items.length > 0) {
        set({ isLoading: true });
        try {
          // Fetch all products to get details
          const allProducts = await getProducts({ limit: 1000 });
          const productsArray = Array.isArray(allProducts.products)
            ? allProducts.products
            : Array.isArray(allProducts)
            ? allProducts
            : [];

          // ✅ Normalize guest cart items to match backend structure
          // ✅ Filter out deleted/inactive products and handle missing products gracefully
          const normalizedItems = [];
          const removedProductIds = [];

          for (const item of guestCart.items) {
            const product = productsArray.find((p) => p._id === item.productId);

            // Skip if product not found, deleted, or inactive
            if (!product) {
              removedProductIds.push(item.productId);
              continue;
            }

            if (product.isDeleted || !product.isActive) {
              removedProductIds.push(item.productId);
              continue;
            }

            // ✅ Adjust quantity if it exceeds available stock
            let quantity = item.quantity;
            if (product.stock !== undefined && quantity > product.stock) {
              if (product.stock > 0) {
                quantity = product.stock; // Reduce to available stock
              } else {
                removedProductIds.push(item.productId); // Remove out of stock items
                continue;
              }
            }

            normalizedItems.push({
              product: {
                _id: product._id,
                title: product.title,
                description: product.description,
                price: product.price,
                discountPrice: product.discountPrice,
                images: product.images,
                stock: product.stock, // ✅ Include stock for frontend warnings
                isActive: product.isActive,
                isDeleted: product.isDeleted,
              },
              quantity,
            });
          }

          // ✅ Update guest cart if products were removed
          if (removedProductIds.length > 0) {
            const updatedGuestCart = {
              items: normalizedItems.map((item) => ({
                productId: item.product._id,
                quantity: item.quantity,
              })),
            };
            saveGuestCart(updatedGuestCart);
          }

          const normalizedCart = {
            items: normalizedItems,
          };

          // Calculate totals for guest cart
          const itemsPrice = normalizedItems.reduce((acc, item) => {
            const price = item.product.discountPrice || item.product.price || 0;
            return acc + price * item.quantity;
          }, 0);
          const shippingPrice = itemsPrice > 297 ? 0 : 50;
          const totalPrice = itemsPrice + shippingPrice;
          const totalItems = normalizedItems.reduce(
            (acc, item) => acc + item.quantity,
            0
          );

          set({
            cart: normalizedCart,
            itemsPrice,
            shippingPrice,
            totalPrice,
            totalItems,
            isLoading: false,
            cartInitialized: true, // ⭐ IMPORTANT
          });
          return;
        } catch (error) {
          if (process.env.NODE_ENV === "development") {
            console.error(
              "Error fetching product details for guest cart:",
              error
            );
          }
          // Fallback to basic guest cart structure
          set({
            cart: guestCart,
            isLoading: false,
            cartInitialized: true, // ⭐ IMPORTANT
          });
          return;
        }
      }

      set({
        cart: guestCart,
        isLoading: false,
        cartInitialized:
          guestCart.items && guestCart.items.length > 0 ? true : false,
      });
      return;
    }

    // ✅ If logged in, fetch from backend
    set({ isLoading: true });
    try {
      const cartData = await fetchCartService();

      const hasReferral = !!cartData.referralCode;
      const hasCoupon = !!cartData.coupon;

      set({
        cart: cartData,
        itemsPrice: cartData.itemsPrice || 0,
        shippingPrice: cartData.shippingPrice || 0,
        totalPrice: cartData.totalPrice || 0,

        // Coupon reset logic
        couponApplied: hasCoupon,
        appliedCouponCode: hasCoupon ? cartData.couponCode : "",
        discount: hasCoupon ? cartData.discount : 0,

        // Referral reset logic
        referralApplied: hasReferral,
        referralCode: hasReferral ? cartData.referralCode : null,
        referralDiscount: hasReferral ? cartData.referralDiscount : 0,

        // Flash offer data
        flashDiscount: cartData.flashDiscount || 0,
        flashDiscountPercent: cartData.flashDiscountPercent || 0,

        isLoading: false,
        cartInitialized: true, // ⭐ FIX HERE
      });
    } catch (error) {
      // ✅ Handle 404 as empty cart (not an error - normal for new users)
      if (error.response?.status === 404) {
        // Cart is empty - this is normal for new users
        set({
          cart: { items: [] },
          itemsPrice: 0,
          shippingPrice: 0,
          totalPrice: 0,
          discount: 0,
          couponApplied: false,
          appliedCouponCode: "",
          flashDiscount: 0,
          flashDiscountPercent: 0,
          referralApplied: false,
          referralCode: null,
          referralDiscount: 0,
          isLoading: false,
          cartInitialized: true, // ⭐ MAKE SURE THIS ALWAYS RUNS
        });
        return;
      }

      if (error.response?.status === 401) {
        // User logged out, switch to guest cart
        const guestCart = getGuestCart();
        set({ cart: guestCart, isLoading: false });
        return;
      }
      if (process.env.NODE_ENV === "development") {
        console.error("Error fetching cart:", error);
      }
      set({ isLoading: false });
    }
  },

  calculateTotals: () => {
    const state = get();
    const { cart } = state;
    const items = cart?.items || [];
    const itemsPrice = cart.itemsPrice || 0;
    const shippingPrice = cart.shippingPrice || 0;
    const discount = state.discount || 0;

    const totalItems = items.reduce(
      (acc, item) => acc + (item.quantity || 0),
      0
    );
    const totalPrice = itemsPrice + shippingPrice - discount;

    set({ totalItems, totalPrice });
  },

  // ✅ Add to cart (works for both guest and authenticated)
  addToCart: async (productId, quantity = 1) => {
    const { user } = useAuthStore.getState();

    set({ isUpdating: true });

    try {
      // ✅ If logged in, use backend
      if (user && user._id) {
        const cartData = await addToCartService(productId, quantity);

        if (cartData.discount && cartData.totalPrice < cartData.minOrderValue) {
          set({
            discount: 0,
            couponApplied: false,
            appliedCouponCode: "",
          });
        }

        set({ cart: cartData, isUpdating: false });
        get().calculateTotals();
        return { success: true, message: "Item added to cart successfully" };
      }

      // ✅ If guest, use localStorage
      const guestCart = getGuestCart();
      const existingItem = guestCart.items.find(
        (item) => item.productId === productId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        guestCart.items.push({ productId, quantity });
      }

      saveGuestCart(guestCart);
      set({ cart: guestCart, isUpdating: false });
      get().calculateTotals();

      return { success: true, message: "Item added to cart successfully" };
    } catch (error) {
      set({ isUpdating: false });

      if (error.response?.status === 401) {
        // User session expired, switch to guest cart
        const guestCart = getGuestCart();
        const existingItem = guestCart.items.find(
          (item) => item.productId === productId
        );

        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          guestCart.items.push({ productId, quantity });
        }

        saveGuestCart(guestCart);
        set({ cart: guestCart });
        return { success: true, message: "Item added to cart (guest mode)" };
      }

      if (process.env.NODE_ENV === "development") {
        console.error("Error adding to cart:", error);
      }

      return {
        success: false,
        message: error.response?.data?.message || "Failed to add item to cart",
      };
    }
  },

  // ✅ Merge guest cart with backend cart on login
  mergeGuestCart: async () => {
    const guestCart = getGuestCart();
    if (!guestCart.items || guestCart.items.length === 0) {
      // No guest cart to merge, just fetch backend cart
      await get().fetchCart();
      return;
    }

    try {
      // Add each guest cart item to backend cart
      for (const item of guestCart.items) {
        try {
          await addToCartService(item.productId, item.quantity);
        } catch (error) {
          // If item already exists or other error, continue with next item
          if (process.env.NODE_ENV === "development") {
            console.warn(
              `Failed to add item ${item.productId} to cart:`,
              error.message
            );
          }
        }
      }

      // Clear guest cart after successful merge
      clearGuestCart();

      // Refresh cart from backend (this will handle 404 gracefully now)
      await get().fetchCart();
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error merging guest cart:", error);
      }
      // Even if merge fails, try to fetch cart (might be empty, which is OK)
      await get().fetchCart();
    }
  },

  updateCart: async (productId, quantity) => {
    const { user } = useAuthStore.getState();

    // Enforce limits
    if (quantity > 5) quantity = 5;
    if (quantity < 1) quantity = 1;

    set({ isUpdating: true });

    try {
      if (user && user._id) {
        // Backend update
        await updateCartItemService(productId, quantity);

        set((state) => {
          // Update items
          const updatedItems = state.cart.items.map((item) =>
            item.product._id === productId ? { ...item, quantity } : item
          );

          // 🔥 Recalculate itemsPrice
          const itemsPrice = updatedItems.reduce((acc, item) => {
            const price = item.product.discountPrice || item.product.price || 0;
            return acc + item.quantity * price;
          }, 0);

          // 🔥 Recalculate shipping
          const shippingPrice = itemsPrice > 297 ? 0 : 50;

          // 🔥 Recalculate total
          const totalPrice = itemsPrice + shippingPrice - state.discount;

          return {
            cart: { ...state.cart, items: updatedItems },
            itemsPrice,
            shippingPrice,
            totalPrice,
          };
        });

        return { success: true };
      }

      // Guest cart
      const guestCart = getGuestCart();
      const item = guestCart.items.find((item) => item.productId === productId);
      if (item) {
        item.quantity = quantity;
        saveGuestCart(guestCart);

        // 🔥 Recalculate totals for guest
        set((state) => {
          return {
            cart: guestCart,
            itemsPrice: state.itemsPrice,
            shippingPrice: state.shippingPrice,
            totalPrice: state.totalPrice,
          };
        });

        get().fetchCart(); // refresh guest totals
        return { success: true };
      }

      return { success: false, message: "Item not found in cart" };
    } catch (error) {
      console.error("Error updating cart:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update cart",
      };
    } finally {
      set({ isUpdating: false });
    }
  },

  removeCartItem: async (productId) => {
    const { user } = useAuthStore.getState();

    set({ isUpdating: true });

    try {
      if (user && user._id) {
        await removeCartItemService(productId);
        set((state) => {
          const updatedItems = state.cart.items.filter(
            (item) => item.product._id !== productId
          );
          const newState = { cart: { ...state.cart, items: updatedItems } };
          if (updatedItems.length === 0) {
            newState.discount = 0;
            newState.couponApplied = false;
            newState.appliedCouponCode = "";
          }
          return newState;
        });
        get().calculateTotals();
        return { success: true };
      } else {
        // Guest cart remove
        const guestCart = getGuestCart();
        guestCart.items = guestCart.items.filter(
          (item) => item.productId !== productId
        );
        saveGuestCart(guestCart);
        set({ cart: guestCart });
        get().calculateTotals();
        return { success: true };
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error removing item:", error);
      }
      return {
        success: false,
        message: error.response?.data?.message || "Failed to remove item",
      };
    } finally {
      set({ isUpdating: false });
    }
  },

  clearCart: async () => {
    const { user } = useAuthStore.getState();

    set({ isUpdating: true });

    try {
      if (user && user._id) {
        await clearCartService();
      }

      // Clear both backend and guest cart
      clearGuestCart();
      set({
        cart: { items: [] },
        itemsPrice: 0,
        shippingPrice: 0,
        totalPrice: 0,
        discount: 0,
        couponApplied: false,
        appliedCouponCode: "",
        totalItems: 0,
      });
      return { success: true };
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error clearing cart:", error);
      }
      return {
        success: false,
        message: error.response?.data?.message || "Failed to clear cart",
      };
    } finally {
      set({ isUpdating: false });
    }
  },

  clearCartOnLogout: () => {
    // Don't clear guest cart on logout, keep it for next session
    set({
      cart: { items: [] },
      itemsPrice: 0,
      shippingPrice: 0,
      totalPrice: 0,
      discount: 0,
      couponApplied: false,
      appliedCouponCode: "",
      totalItems: 0,
    });
  },

  // ✅ Apply coupon (only for logged in users)
  applyCoupon: async (code) => {
    const { user } = useAuthStore.getState();
    const { referralApplied, couponApplied } = get();

    if (!user || !user._id) {
      return { success: false, message: "Please login to apply coupon" };
    }
    if (referralApplied) {
      return {
        success: false,
        message: "Referral already applied. Remove referral to use coupon.",
      };
    }

    if (couponApplied) {
      return { success: false, message: "Coupon already applied." };
    }

    try {
      set({ isUpdating: true, couponError: null });
      const res = await applyCouponService(code);

      if (res.success) {
        await get().fetchCart();
        set({
          couponApplied: true,
          appliedCouponCode: code,
          discount: res.data?.discount || 0,
        });
        return { success: true, message: res.message };
      } else {
        const msg = res.message || "Invalid coupon code";
        set({ couponError: msg });
        return { success: false, message: msg };
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || "Invalid or expired coupon code";
      set({ couponError: msg });
      return { success: false, message: msg };
    } finally {
      set({ isUpdating: false });
    }
  },

  removeCoupon: async () => {
    const { user } = useAuthStore.getState();

    if (!user || !user._id) {
      return { success: false, message: "Please login to remove coupon" };
    }

    set({ isUpdating: true, couponError: "" });
    try {
      const response = await removeCouponService();
      set((state) => ({
        discount: 0,
        couponApplied: false,
        appliedCouponCode: "",
        cart: {
          ...state.cart,
          totalPrice: response.totalPrice || state.totalPrice,
        },
      }));
      get().calculateTotals();
      return { success: true };
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error removing coupon:", error);
      }
      set({ couponError: error.response?.data?.message || error.message });
      return {
        success: false,
        message: error.response?.data?.message || error.message,
      };
    } finally {
      set({ isUpdating: false });
    }
  },

  applyReferral: async (referralCode) => {
    const { user } = useAuthStore.getState();
    const { couponApplied, referralApplied } = get();

    if (!user || !user._id) {
      return { success: false, message: "Please login to apply referral" };
    }

    if (couponApplied) {
      return {
        success: false,
        message: "Coupon already applied. Remove coupon to use referral.",
      };
    }

    if (referralApplied) {
      return { success: false, message: "Referral already applied." };
    }

    set({ isUpdating: true });
    try {
      const res = await applyReferralService({ referralCode });
      await get().fetchCart();
      return { success: true, data: res };
    } catch (err) {
      const message =
        err.response?.data?.message || "Invalid or expired referral code";
      return { success: false, message };
    } finally {
      set({ isUpdating: false });
    }
  },

  removeReferral: async () => {
    const { user } = useAuthStore.getState();

    if (!user || !user._id) {
      return { success: false, message: "Please login to remove referral" };
    }

    set({ isUpdating: true });
    try {
      await removeReferralService();
      await get().fetchCart();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      set({ isUpdating: false });
    }
  },

  setBuyNowProduct: (productId) => set({ buyNowProductId: productId }),

  clearBuyNow: () => set({ buyNowProductId: null }),
}));

export default useCartStore;
