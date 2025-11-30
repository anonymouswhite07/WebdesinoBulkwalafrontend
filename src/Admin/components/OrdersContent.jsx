import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useAdminOrdersStore } from "@/store/adminOrders.store";
import { toast } from "sonner";
import OrderDetailDialog from "./OrderDetailDialog";
export default function OrdersContent() {
  const {
    orders,
    loading,
    error,
    filters,
    setFilters,
    fetchOrders,
    lastRefreshed,
    stats,
  } = useAdminOrdersStore();

  const [pagination, setPagination] = useState({ page: 1, limit: 15 });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchOrders(pagination);
  }, [pagination]);

  useEffect(() => {
    const interval = setInterval(() => fetchOrders(pagination), 300000); // every 5 min
    return () => clearInterval(interval);
  }, [pagination]);

  const filtered = orders.filter((o) => {
    const q = filters.q.trim().toLowerCase();
    const byQ =
      !q ||
      o._id?.toLowerCase().includes(q) ||
      o.user?.email?.toLowerCase().includes(q) ||
      o.user?.name?.toLowerCase().includes(q);

    const byStatus = filters.status === "ALL" || o.status === filters.status;
    const byPay =
      filters.paymentStatus === "ALL" ||
      (o.paymentStatus || "").toUpperCase() === filters.paymentStatus;

    return byQ && byStatus && byPay;
  });

  const badge = (text, cls) => (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${cls}`}>
      {text}
    </span>
  );

  const statusBadge = (status) => {
    switch (status) {
      case "Processing":
        return badge("Processing", "bg-yellow-100 text-yellow-700");

      case "Shipped":
        return badge("Shipped", "bg-blue-100 text-blue-700");
      case "Delivered":
        return badge("Delivered", "bg-green-100 text-green-700");
      case "Cancelled":
        return badge("Cancelled", "bg-red-100 text-red-700");
      default:
        return badge(status || "-", "bg-gray-100 text-gray-700");
    }
  };

  const payBadge = (ps) => {
    const up = (ps || "").toUpperCase();
    if (up === "SUCCESS")
      return badge("SUCCESS", "bg-green-100 text-green-700");
    if (up === "PENDING")
      return badge("PENDING", "bg-yellow-100 text-yellow-700");
    if (up === "FAILED") return badge("FAILED", "bg-red-100 text-red-700");
    return badge(up || "-", "bg-gray-100 text-gray-700");
  };

  const totalOrders = stats.totalOrders || filtered.length;
  const totalPages = Math.ceil(totalOrders / pagination.limit) || 1;

  return (
    <>
      {/* Stats */}
      <Card className="mb-6 bg-white border border-gray-200 rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#02066F]">Orders Overview</CardTitle>
          <CardDescription>Quick business metrics</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {[
            ["Total Orders", stats.totalOrders],
            ["Revenue", `₹${stats.totalRevenue?.toFixed(2)}`],
            ["Processing", stats.processing],
            ["Delivered", stats.delivered],
            ["Cancelled", stats.cancelled],
            ["Paid (Success)", stats.successPayments],
          ].map(([label, val]) => (
            <div key={label} className="p-3 rounded-lg bg-gray-50">
              <p className="text-sm text-gray-500">{label}</p>
              <p className="text-xl font-semibold">{val}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="mb-4 bg-white border border-gray-200 rounded-xl shadow-sm">
        <CardContent className="flex flex-col md:flex-row gap-3 md:items-center py-4">
          <input
            className="border rounded-md px-3 py-2 w-full"
            placeholder="Search by order id / email / name"
            value={filters.q}
            onChange={(e) => setFilters({ q: e.target.value })}
          />
          <select
            className="border rounded-md px-3 py-2"
            value={filters.status}
            onChange={(e) => setFilters({ status: e.target.value })}
          >
            <option value="ALL">All Status</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <select
            className="border rounded-md px-3 py-2"
            value={filters.paymentStatus}
            onChange={(e) => setFilters({ paymentStatus: e.target.value })}
          >
            <option value="ALL">All Payments</option>
            <option value="PENDING">PENDING</option>
            <option value="SUCCESS">SUCCESS</option>
            <option value="FAILED">FAILED</option>
          </select>
          <Button variant="outline" onClick={() => fetchOrders(pagination)}>
            Refresh
          </Button>
          {lastRefreshed && (
            <p className="text-xs text-gray-500 ml-2">
              Last updated: {new Date(lastRefreshed).toLocaleTimeString()}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <CardContent className="p-0 overflow-hidden">
          {loading ? (
            <p className="text-center py-8 text-gray-500">Loading orders...</p>
          ) : error ? (
            <p className="text-center py-8 text-red-500">{error}</p>
          ) : filtered.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No orders found.</p>
          ) : (
            <>
              <table className="w-full border-collapse table-auto">
                <thead className="bg-gray-100 text-gray-700 text-sm">
                  <tr>
                    <th className="p-3 text-left">Order</th>
                    <th className="p-3 text-left">Products</th>
                    <th className="p-3 text-left">SKU</th>
                    <th className="p-3 text-right">Total</th>
                    <th className="p-3 text-center">Payment</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {filtered
                    .slice(
                      (pagination.page - 1) * pagination.limit,
                      pagination.page * pagination.limit
                    )
                    .map((o, idx) => {
                      const shortId = o._id?.slice(-6)?.toUpperCase();
                      return (
                        <tr
                          key={o._id}
                          onClick={() => {
                            setSelectedOrder(o);
                            setIsDialogOpen(true);
                          }}
                          className={`transition cursor-pointer ${
                            idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                          } hover:bg-blue-50/60 hover:shadow-md hover:scale-[1.01]`}
                          style={{ transition: "all 0.2s ease" }}
                        >
                          {/* 🧾 Order Info */}
                          <td className="p-3 font-mono text-gray-700">
                            <div className="flex items-center gap-1">
                              <span className="font-semibold">#{shortId}</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigator.clipboard.writeText(o._id);
                                }}
                                className="text-gray-400 hover:text-blue-500 text-xs"
                                title="Copy full ID"
                              >
                                📋
                              </button>
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              {new Date(o.createdAt).toLocaleDateString()}
                            </div>
                          </td>

                          {/* 🛍️ Product Titles */}
                          <td className="p-3">
                            <div className="text-gray-800 font-medium text-sm leading-tight">
                              {o.products && o.products.length > 0 ? (
                                <>
                                  {o.products.slice(0, 2).map((p, i) => (
                                    <div
                                      key={i}
                                      className="truncate max-w-[180px]"
                                    >
                                      • {p.product?.title || "Unnamed Product"}{" "}
                                      × {p.quantity}
                                    </div>
                                  ))}
                                  {o.products.length > 2 && (
                                    <div className="text-xs text-gray-500 italic">
                                      +{o.products.length - 2} more
                                    </div>
                                  )}
                                </>
                              ) : (
                                <div className="text-gray-400 text-sm">
                                  No products
                                </div>
                              )}
                            </div>

                            {/* 👤 Customer Info */}
                            <div className="text-xs text-gray-500 mt-2">
                              {o.user?.name || "Unknown"}{" "}
                              <span className="text-gray-400">
                                ({o.user?.email || "No email"})
                              </span>
                            </div>
                          </td>

                          {/* 🧾 SKU Column — now its own <td> */}
                          <td className="p-3 text-gray-700">
                            {o.products && o.products.length > 0 ? (
                              <>
                                {o.products.slice(0, 2).map((p, i) => (
                                  <div
                                    key={i}
                                    className="truncate max-w-[150px] text-sm"
                                  >
                                    {p.product?.sku || "—"}
                                  </div>
                                ))}
                                {o.products.length > 2 && (
                                  <div className="text-xs text-gray-500 italic">
                                    +{o.products.length - 2} more
                                  </div>
                                )}
                              </>
                            ) : (
                              <div className="text-gray-400 text-sm">—</div>
                            )}
                          </td>

                          {/* 💰 Total */}
                          <td className="p-3 text-right font-semibold text-gray-800">
                            ₹{(o.totalPrice || 0).toFixed(2)}
                          </td>

                          {/* 💳 Payment */}
                          <td className="p-3 text-center">
                            <div className="flex flex-col items-center">
                              {payBadge(o.paymentStatus)}
                              <span className="uppercase text-gray-600 text-xs">
                                {o.paymentMode}
                              </span>
                            </div>
                          </td>

                          {/* 📦 Status */}
                          <td className="p-3 text-center">
                            {statusBadge(o.status)}
                          </td>

                          {/* ⚙️ Actions */}
                          <td className="p-3 text-center">
                            <OrderActions order={o} fetchOrders={fetchOrders} />
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
              <OrderDetailDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                order={selectedOrder}
              />

              {/* Pagination */}
              {totalOrders > pagination.limit && (
                <div className="flex justify-center items-center gap-4 mt-6 py-4">
                  <Button
                    variant="outline"
                    disabled={pagination.page === 1}
                    onClick={() =>
                      setPagination((p) => ({ ...p, page: p.page - 1 }))
                    }
                  >
                    Prev
                  </Button>
                  <span>
                    Page {pagination.page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={pagination.page === totalPages}
                    onClick={() =>
                      setPagination((p) => ({ ...p, page: p.page + 1 }))
                    }
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
}

function OrderActions({ order, fetchOrders }) {
  const { syncOneOrder, retryShipment } = useAdminOrdersStore();

  // 🧩 If order is pickup, don't show shipment controls
  if (order.paymentMode === "pickup") {
    return (
      <div className="flex flex-col items-center gap-1">
        <p className="text-[11px] text-blue-700 font-medium">
          Pickup from Store
        </p>
        <p className="text-[10px] text-gray-500">No shipping required</p>
      </div>
    );
  }

  // 🧩 For normal shipped orders
  return (
    <div className="flex flex-col items-center gap-1">
      {order.trackingId && (
        <a
          href={`https://www.delhivery.com/tracking?waybill=${order.trackingId}`}
          target="_blank"
          rel="noreferrer"
          className="text-[10px] text-blue-600 underline"
        >
          {order.trackingId}
        </a>
      )}

      <p className="text-[10px] text-gray-500">
        {order.courierName || "Delhivery"}{" "}
        {order.shipmentStatus ? `· ${order.shipmentStatus}` : ""}
      </p>

      <Button
        size="sm"
        variant="outline"
        className="text-xs mt-1"
        onClick={async () => {
          const res = await syncOneOrder(order._id);
          if (res.success) {
            toast.success("Synced with Delhivery");
            fetchOrders();
          } else toast.error(res.message);
        }}
      >
        🔄 Sync Status
      </Button>

      {(!order.trackingId || order.shipmentStatus?.startsWith("Error")) && (
        <Button
          size="sm"
          variant="destructive"
          className="text-xs mt-1"
          onClick={async () => {
            const res = await retryShipment(order._id);
            if (res.success) {
              toast.success("Shipment recreated");
              fetchOrders();
            } else toast.error(res.message);
          }}
        >
          🚚 Retry Shipment
        </Button>
      )}
    </div>
  );
}
