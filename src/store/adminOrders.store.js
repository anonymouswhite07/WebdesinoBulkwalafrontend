import { create } from "zustand";
import {
  downloadLabelService,
  getAllOrdersService,
  retryShipmentService,
  syncShipmentService,
  updateOrderStatusService,
  updatePaymentStatusService,
} from "@/services/admin-orders.service";

export const useAdminOrdersStore = create((set, get) => ({
  orders: [],
  loading: false,
  error: null,
  lastRefreshed: null,

  filters: {
    q: "",
    status: "ALL",
    paymentStatus: "ALL",
  },

  stats: {
    totalOrders: 0,
    totalRevenue: 0,
    pending: 0,
    delivered: 0,
    cancelled: 0,
    successPayments: 0,
  },

  setFilters: (patch) => set((s) => ({ filters: { ...s.filters, ...patch } })),

  fetchOrders: async () => {
    const { loading } = get();
    if (loading) return; // prevent overlap fetches

    set({ loading: true, error: null });
    try {
      const data = await getAllOrdersService();
      const totalOrders = data.length;
      const totalRevenue = data.reduce(
        (sum, o) => sum + (o.totalPrice || 0),
        0
      );
      const processing = data.filter((o) => o.status === "Processing").length;
      const delivered = data.filter((o) => o.status === "Delivered").length;
      const cancelled = data.filter((o) => o.status === "Cancelled").length;
      const successPayments = data.filter(
        (o) => (o.paymentStatus || "").toUpperCase() === "SUCCESS"
      ).length;

      set({
        orders: data,
        loading: false,
        lastRefreshed: new Date().toISOString(),

        stats: {
          totalOrders,
          totalRevenue,
          processing,
          delivered,
          cancelled,
          successPayments,
        },
      });
      return { success: true };
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error fetching orders:", e);
      }
      set({
        loading: false,
        error: e?.response?.data?.message || "Failed to fetch orders",
      });
      return {
        success: false,
        message: e?.response?.data?.message || "Failed to fetch orders",
      };
    }
  },

  // Update order status
  updateOrderStatus: async (orderId, status) => {
    try {
      const updated = await updateOrderStatusService(orderId, status);
      // patch local list
      set((s) => ({
        orders: s.orders.map((o) =>
          o._id === orderId
            ? {
                ...o,
                status: updated.status,
                deliveredAt: updated.deliveredAt,
                cancelledAt: updated.cancelledAt,
              }
            : o
        ),
      }));
      return { success: true };
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error updating order status:", e);
      }
      return {
        success: false,
        message: e?.response?.data?.message || "Failed to update status",
      };
    }
  },

  // Update payment status
  updatePaymentStatus: async (orderId, paymentStatus) => {
    try {
      const updated = await updatePaymentStatusService(orderId, paymentStatus);
      set((s) => ({
        orders: s.orders.map((o) =>
          o._id === orderId ? { ...o, paymentStatus: updated.paymentStatus } : o
        ),
      }));
      return { success: true };
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error updating payment status:", e);
      }
      return {
        success: false,
        message:
          e?.response?.data?.message || "Failed to update payment status",
      };
    }
  },

  syncOneOrder: async (orderId) => {
    try {
      const updated = await syncShipmentService(orderId);
      set((s) => ({
        orders: s.orders.map((o) =>
          o._id === orderId ? { ...o, ...updated } : o
        ),
      }));
      return { success: true };
    } catch (e) {
      return { success: false, message: "Failed to sync shipment" };
    }
  },

  retryShipment: async (orderId) => {
    try {
      const updated = await retryShipmentService(orderId);
      set((s) => ({
        orders: s.orders.map((o) =>
          o._id === orderId ? { ...o, ...updated } : o
        ),
      }));
      return { success: true };
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error retrying shipment:", e);
      }
      return {
        success: false,
        message: e?.response?.data?.message || "Failed to retry shipment",
      };
    }
  },

  downloadLabel: async (orderId) => {
    try {
      const blob = await downloadLabelService(orderId);
      return { success: true, blob };
    } catch (e) {
      return {
        success: false,
        message: e?.response?.data?.message || "Failed to download label",
      };
    }
  },
}));
