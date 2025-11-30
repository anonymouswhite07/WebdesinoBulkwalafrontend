import { create } from "zustand";
import {
  cancelOrderService,
  createOrderService,
  getMyOrdersService,
  getSingleOrderService,
  trackOrderService,
  verifyOrderService,
} from "@/services/order.service";
import useAuthStore from "./auth.store";

const useOrderStore = create((set, get) => ({
  orders: [],
  singleOrder: null,
  error: null,
  paymentMode: "",
  isLoading: false,
  paymentStatus: "PENDING",
  orderId: "",
  razorpayOrderId: "",
  amount: 0,
  trackingData: null,
  user: null, // ✅ Store user for Razorpay prefill

  setPaymentMode: (mode) => set({ paymentMode: mode }),
  
  resetPaymentStatus: () => set({ paymentStatus: "PENDING" }),

  handlePayment: async (cart, shippingAddress) => {
    const { paymentMode } = get();
    const { user } = useAuthStore.getState(); // ✅ Get user data for Razorpay prefill

    if (!paymentMode) {
      if (process.env.NODE_ENV === "development") {
        console.error("No payment mode selected");
      }
      return;
    }

    set({ isLoading: true, user }); // ✅ Store user in state for prefill

    try {
      const orderPayload = {
        products: cart.items.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
        })),
        shippingAddress,
        paymentMode,
      };

      // Step 1: Create Order
      const res = await createOrderService(orderPayload);
      // Step 2: COD / PICKUP flow
      if (paymentMode === "cod" || paymentMode === "pickup") {
        const statusText =
          paymentMode === "pickup"
            ? "Pickup order placed successfully"
            : "COD order placed successfully";

        set({ isLoading: false, paymentStatus: "SUCCESS" });

        return {
          type: paymentMode.toUpperCase(),
          order: res,
          message: statusText,
        };
      }

      // Step 3: Online flow
      const { razorpayOrderId, amount, currency } = res;
      set({ razorpayOrderId, amount });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount * 100,
        currency,
        order_id: razorpayOrderId,
        name: "Bulkwala Store",
        description: "Order Payment",
        handler: async function (response) {
          if (process.env.NODE_ENV === "development") {
            console.log("response from razorpay handler", response);
          }
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
            response;
          set({ isLoading: true });
          try {
            const verifyResponse = await verifyOrderService({
              razorpay_order_id,
              razorpay_payment_id,
              razorpay_signature,
            });

            if (process.env.NODE_ENV === "development") {
              console.log("verifyOrderService response:", verifyResponse);
            }

            const verifiedOrder = verifyResponse?.populatedOrder;

            // ✅ Stop loader first
            set({ isLoading: false, paymentStatus: "SUCCESS" });

            // ✅ Trigger success event slightly after loader clears
            setTimeout(() => {
              window.dispatchEvent(
                new CustomEvent("razorpay-success", {
                  detail: { order: verifiedOrder },
                })
              );
            }, 100);
          } catch (error) {
            if (process.env.NODE_ENV === "development") {
              console.error("Error verifying payment:", error);
            }
            set({ isLoading: false, paymentStatus: "FAILED" });
            // Optionally, pass error details if component wants to handle message
            window.dispatchEvent(
              new CustomEvent("razorpay-failed", {
                detail: { error },
              })
            );
          }
        },

        modal: {
          ondismiss: () => {
            set({
              paymentStatus: "CANCELLED",
              isLoading: false,
            });
          },
        },
        prefill: {
          name: user?.name || "Customer",
          email: user?.email || "",
          contact: user?.phone || "",
        },
        theme: { color: "#02066F" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      return { message: "Razorpay window opened", type: "ONLINE" };
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Payment initiation failed", error);
      }
      set({ isLoading: false });
    }
  },

  fetchMyOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await getMyOrdersService();
      set({ orders: res, isLoading: false });
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error fetching orders:", error);
      }
      set({
        error: error.response?.data?.message || "Failed to fetch orders",
        isLoading: false,
      });
    }
  },

  fetchSingleOrder: async (orderId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await getSingleOrderService(orderId);
      set({ singleOrder: res, isLoading: false });
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error fetching order details:", error);
      }
      set({
        error: error.response?.data?.message || "Failed to fetch order details",
        isLoading: false,
      });
    }
  },

  fetchTrackingData: async (orderId) => {
    set({ isLoading: true, error: null });
    try {
      const data = await trackOrderService(orderId);
      set({ trackingData: data, isLoading: false });
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error fetching tracking:", error);
      }
      set({
        error:
          error.response?.data?.message ||
          "Failed to fetch tracking information",
        isLoading: false,
      });
    }
  },

  cancelOrder: async (orderId) => {
    set({ isLoading: true });
    try {
      const res = await cancelOrderService(orderId);
      set({ singleOrder: res, isLoading: false });
      return { success: true, order: res };
    } catch (error) {
      set({ isLoading: false });
      if (process.env.NODE_ENV === "development") {
        console.error("Cancel order failed:", error);
      }
      return {
        success: false,
        message: error.response?.data?.message || "Failed to cancel order",
      };
    }
  },
}));

export default useOrderStore;
