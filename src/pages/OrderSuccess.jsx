import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, Download } from "lucide-react";
import { generateInvoicePDF } from "../lib/invoiceGenerator";

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const orderData = location.state?.orderData || {};
  const paymentType = location.state?.paymentType || "Online Payment";

  const orderId = orderData?._id || "N/A";
  const totalAmount = orderData?.totalPrice || 0;
  const paymentStatus = orderData?.paymentStatus || "N/A";
  const itemCount = orderData?.products?.length || 0;
  const city = orderData?.shippingAddress?.city || "N/A";
  const customerName = orderData?.shippingAddress?.name || "N/A";
  const paymentMode = orderData?.paymentMode?.toUpperCase() || "N/A";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 py-8">
      <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-8 md:p-10 text-center max-w-md sm:max-w-lg w-full">
        {/* ICON */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <CheckCircle2 size={70} className="text-green-500" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          Order Placed Successfully 🎉
        </h1>

        <p className="text-gray-600 mb-6">
          Thank you for your purchase! Your{" "}
          <span className="font-semibold">{paymentType}</span> order is
          confirmed.
        </p>

        {/* ORDER SUMMARY */}
        <div className="bg-gray-100 rounded-lg text-left p-4 mb-6 text-gray-700 space-y-1">
          <p>
            <strong>Order ID:</strong> {orderId}
          </p>
          <p>
            <strong>Customer:</strong> {customerName}
          </p>
          <p>
            <strong>Items:</strong> {itemCount}
          </p>
          <p>
            <strong>Payment Mode:</strong> {paymentMode}
          </p>
          <p>
            <strong>Payment Status:</strong> {paymentStatus.toUpperCase()}
          </p>
          <p>
            <strong>Shipping City:</strong> {city}
          </p>
          <hr className="my-2 border-gray-300" />
          <p>
            <strong>Total Amount:</strong> ₹{totalAmount.toFixed(2)}
          </p>
        </div>

        {/* DOWNLOAD INVOICE */}
        <button
          onClick={() => generateInvoicePDF(orderData)}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition mb-3"
        >
          <Download size={18} />
          Download Invoice (PDF)
        </button>

        {/* NAVIGATION */}
        <button
          onClick={() => navigate("/my-orders")}
          className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition"
        >
          View My Orders
        </button>

        <button
          onClick={() => navigate("/")}
          className="mt-4 text-gray-600 hover:underline text-sm"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;
