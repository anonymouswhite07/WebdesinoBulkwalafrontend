import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useOrderStore from "@/store/order.store";
import { Button } from "@/components/ui/button";

const ITEMS_PER_PAGE = 10;

const MyOrders = () => {
  const { orders, isLoading, fetchMyOrders, error } = useOrderStore();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchMyOrders();
  }, []);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  // ✅ Sort latest orders first (by creation date)
  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const totalPages = Math.ceil(sortedOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = sortedOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (isLoading)
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-500">
        Loading your orders...
      </div>
    );

  if (orders.length === 0)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-gray-600 text-center px-4">
        <p className="text-base sm:text-lg">
          You haven’t placed any orders yet.
        </p>
        <Button
          className="mt-4 bg-[#02066F] w-full sm:w-auto"
          onClick={() => navigate("/products")}
        >
          Browse Products
        </Button>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 font-inter">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center sm:text-left">
        My Orders
      </h1>

      {/* 📱 Mobile View (Cards) */}
      <div className="grid grid-cols-1 gap-4 sm:hidden">
        {paginatedOrders.map((order) => (
          <div
            key={order._id}
            className="bg-white shadow-sm border rounded-xl p-4 space-y-3"
          >
            <div className="flex justify-between items-center">
              <p className="font-semibold text-gray-800 text-sm">
                #{order._id.slice(-6).toUpperCase()}
              </p>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
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
            </div>

            <div className="flex items-center gap-3">
              <img
                src={
                  order.products[0]?.product?.images?.[0] ||
                  "https://via.placeholder.com/60"
                }
                alt="product"
                className="w-16 h-16 rounded-md object-cover border"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700 line-clamp-2">
                  {order.products[0]?.product?.title || "Product"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {order.products?.length} item
                  {order.products?.length > 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-base font-semibold text-[#02066F]">
                ₹{order.totalPrice.toFixed(2)}
              </p>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  className="text-[#02066F] border-[#02066F] text-xs px-3 py-1"
                  onClick={() => navigate(`/order/${order._id}`)}
                >
                  View
                </Button>

                {order.trackingId ? (
                  <Button
                    variant="outline"
                    className="text-green-700 border-green-700 text-xs px-3 py-1"
                    onClick={() => navigate(`/track/${order._id}`)}
                  >
                    Track
                  </Button>
                ) : order.paymentMode === "pickup" ? (
                  <p className="text-xs text-blue-600 text-center font-medium">
                    Picked from store
                  </p>
                ) : (
                  <p className="text-xs text-gray-400 text-center">
                    Awaiting Tracking ID
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 💻 Desktop Table View */}
      <div className="hidden sm:block overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-[#F7F9FC]">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Order ID
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Product
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Total
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Payment
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Status
              </th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedOrders.map((order) => (
              <tr
                key={order._id}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="px-4 py-3 text-gray-800 font-medium">
                  #{order._id.slice(-6).toUpperCase()}
                </td>

                <td className="px-4 py-3 flex items-center space-x-3">
                  <img
                    src={
                      order.products[0]?.product?.images?.[0] ||
                      "https://via.placeholder.com/60"
                    }
                    alt="product"
                    className="w-10 h-10 rounded-md object-cover border"
                  />
                  <span className="text-gray-700">
                    {order.products[0]?.product?.title || "Product"}
                  </span>
                </td>

                <td className="px-4 py-3 text-gray-700">
                  ₹{order.totalPrice.toFixed(2)}
                </td>

                <td className="px-4 py-3 text-gray-700">
                  {order.paymentStatus}
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
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
                </td>

                <td className="px-4 py-3 text-center space-y-2">
                  <Button
                    variant="outline"
                    className="text-[#02066F] border-[#02066F] text-xs px-3 py-1 w-full"
                    onClick={() => navigate(`/order/${order._id}`)}
                  >
                    View Details
                  </Button>

                  {order.trackingId ? (
                    <Button
                      variant="outline"
                      className="text-green-700 border-green-700 text-xs px-3 py-1 w-full"
                      onClick={() => navigate(`/track/${order._id}`)}
                    >
                      Track
                    </Button>
                  ) : order.paymentMode === "pickup" ? (
                    <p className="text-xs text-blue-600 font-medium">
                      Picked from Store
                    </p>
                  ) : (
                    <p className="text-xs text-gray-400">
                      Awaiting Tracking ID
                    </p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📄 Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 space-x-2">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Prev
          </Button>

          <span className="text-gray-700 text-sm font-medium">
            Page {currentPage} of {totalPages}
          </span>

          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
