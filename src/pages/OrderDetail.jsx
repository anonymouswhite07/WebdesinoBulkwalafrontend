import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useOrderStore from "@/store/order.store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { generateInvoicePDF } from "../lib/invoiceGenerator";
import { Download } from "lucide-react";

const OrderDetail = () => {
  const { orderId } = useParams();
  const {
    singleOrder: order,
    isLoading,
    fetchSingleOrder,
    error,
    cancelOrder,
  } = useOrderStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSingleOrder(orderId);
  }, [orderId]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handleCancelOrder = async () => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );
    if (!confirmCancel) return;

    const result = await cancelOrder(orderId);
    if (result.success) {
      toast.success("Order cancelled successfully!");
      fetchSingleOrder(orderId); // refresh order details
    } else {
      toast.error(result.message);
    }
  };

  const canCancelOrder = (order) => {
    if (!order) return false;

    // ❌ Not allowed if any of these
    if (
      order.status === "Shipped" ||
      order.status === "Delivered" ||
      order.status === "Cancelled"
    ) {
      return false;
    }

    // ✅ Allowed only when Processing
    if (order.status === "Processing") {
      return true;
    }

    return false;
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-500">
        Loading order details...
      </div>
    );

  if (!order)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-gray-600 px-4 text-center">
        <p className="text-base sm:text-lg">Order not found.</p>
        <Button
          className="mt-4 bg-[#02066F]"
          onClick={() => navigate("/my-orders")}
        >
          Back to Orders
        </Button>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-inter">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center sm:text-left">
        Order Details
      </h1>

      {/* 🧾 ORDER SUMMARY */}
      <Card className="mb-6 border-gray-200 shadow-sm">
        <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <CardTitle className="text-base sm:text-lg font-semibold">
            Order #{order._id.slice(-6).toUpperCase()}
          </CardTitle>
          {/* DOWNLOAD INVOICE BUTTON */}
          <Button
            onClick={() => generateInvoicePDF(order)}
            className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto flex items-center gap-2"
          >
            <Download size={16} />
            Download Invoice
          </Button>

          <span
            className={`text-xs sm:text-sm px-3 py-1 rounded-full font-medium self-start sm:self-auto ${
              order.status === "Delivered"
                ? "bg-green-100 text-green-700"
                : order.status === "Cancelled"
                ? "bg-red-100 text-red-700"
                : order.status === "Shipped"
                ? "bg-blue-100 text-blue-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {order.status}
          </span>
        </CardHeader>

        <CardContent className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-700">
          <p>
            <strong>Payment Status:</strong> {order.paymentStatus}
          </p>
          <p>
            <strong>Payment Mode:</strong> {order.paymentMode?.toUpperCase()}
          </p>
          {order.transactionId && (
            <p>
              <strong>Transaction ID:</strong> {order.transactionId}
            </p>
          )}
          <p>
            <strong>Items Price:</strong> ₹{order.itemsPrice.toFixed(2)}
          </p>

          <p>
            <strong>Shipping Price:</strong> ₹{order.shippingPrice.toFixed(2)}
          </p>
          <p className="text-base sm:text-lg font-semibold text-gray-900 border-t pt-2">
            Total Amount: ₹{order.totalPrice.toFixed(2)}
          </p>

          <div className="pt-2 text-sm sm:text-base text-gray-500 space-y-1">
            <p>
              <strong>Order Created:</strong>{" "}
              {new Date(order.createdAt).toLocaleString()}
            </p>

            {order.trackingId && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <p>
                  <strong>Tracking ID:</strong> {order.trackingId}
                </p>
                <Button
                  variant="outline"
                  className="text-xs sm:text-sm text-[#02066F] border-[#02066F] w-full sm:w-auto"
                  onClick={() => navigate(`/track/${order._id}`)}
                >
                  Track Shipment
                </Button>
              </div>
            )}

            {order.deliveredAt && (
              <p>
                <strong>Delivered At:</strong>{" "}
                {new Date(order.deliveredAt).toLocaleString()}
              </p>
            )}
            {order.cancelledAt && (
              <p>
                <strong>Cancelled At:</strong>{" "}
                {new Date(order.cancelledAt).toLocaleString()}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 🚚 SHIPPING DETAILS */}
      <Card className="mb-6 border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg font-semibold">
            Shipping Address
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm sm:text-base text-gray-700 space-y-1 sm:space-y-2">
          <p>
            <strong>Name:</strong> {order.shippingAddress?.name}
          </p>
          <p>
            <strong>Phone:</strong> {order.shippingAddress?.phone}
          </p>
          <p>
            <strong>Address:</strong>{" "}
            {`${order.shippingAddress?.street}, ${order.shippingAddress?.city}, ${order.shippingAddress?.state} - ${order.shippingAddress?.postalCode}`}
          </p>
          <p>
            <strong>Country:</strong> {order.shippingAddress?.country}
          </p>
        </CardContent>
      </Card>

      {/* 🛍️ PRODUCT DETAILS */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg font-semibold">
            Ordered Products
          </CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-gray-100">
          {order.products.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={
                    item.product?.images?.[0] ||
                    "https://via.placeholder.com/80"
                  }
                  alt={item.product?.title}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-md object-cover border"
                />
                <div>
                  <p className="text-gray-800 font-medium text-sm sm:text-base">
                    {item.product?.title}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Qty: {item.quantity} × ₹{item.priceAtPurchase.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="text-right sm:text-left">
                <span className="text-sm sm:text-base text-gray-800 font-semibold">
                  ₹{(item.quantity * item.priceAtPurchase).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 🔙 ACTION BUTTONS */}
      <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
        {canCancelOrder(order) ? (
          <Button
            onClick={handleCancelOrder}
            className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto"
            disabled={isLoading}
          >
            {isLoading ? "Cancelling..." : "Cancel Order"}
          </Button>
        ) : (
          <Button
            disabled
            className="bg-gray-300 text-gray-600 w-full sm:w-auto cursor-not-allowed"
          >
            {order.status === "Cancelled"
              ? "Order Cancelled"
              : order.status === "Shipped"
              ? "Already Shipped"
              : order.status === "Delivered"
              ? "Delivered"
              : "Cannot Cancel"}
          </Button>
        )}

        <Button
          className="bg-[#02066F] hover:bg-[#03136e] w-full sm:w-auto"
          onClick={() => navigate("/my-orders")}
        >
          Back to My Orders
        </Button>
      </div>
    </div>
  );
};

export default OrderDetail;
