import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { couponSchema } from "@/schemas/couponSchema";
import { useCouponStore } from "@/store/coupon.store";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CouponManager() {
  const { coupons, fetchCoupons, createCoupon, deleteCoupon, isLoading } =
    useCouponStore();
  const [deletingId, setDeletingId] = useState(null);

  const form = useForm({ resolver: zodResolver(couponSchema) });

  useEffect(() => {
    fetchCoupons();
    const interval = setInterval(() => {
      fetchCoupons();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const onSubmit = async (data) => {
    const res = await createCoupon(data);
    if (res.success) {
      toast.success("Coupon created successfully!");
      form.reset();
      fetchCoupons();
    } else toast.error(res.message || "Failed to create coupon");
  };

  const onDelete = async (couponId) => {
    setDeletingId(couponId);
    const res = await deleteCoupon(couponId);
    setDeletingId(null);

    if (res.success) {
      toast.success("Coupon deleted successfully!");
      fetchCoupons();
    } else {
      toast.error(res.message || "Failed to delete coupon");
    }
  };

  return (
    <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-[#02066F] font-semibold">
          Coupon Management
        </CardTitle>
        <CardDescription>
          Create and manage discount coupons for users.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* ✅ Create Coupon Form */}
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
        >
          <Input placeholder="Coupon Code" {...form.register("code")} />
          <select
            {...form.register("discountType")}
            className="border rounded-md px-3 py-2"
            defaultValue="percentage"
          >
            <option value="percentage">Percentage</option>
            <option value="flat">Flat</option>
          </select>
          <Input
            type="number"
            placeholder="Discount Value"
            {...form.register("discountValue")}
          />
          <Input type="date" {...form.register("expiryDate")} />
          <Input
            type="number"
            placeholder="Min Order Value"
            {...form.register("minOrderValue")}
          />
          <Input
            type="number"
            placeholder="Usage Limit"
            {...form.register("usageLimit")}
          />

          <div className="col-span-full flex justify-end">
            <Button
              type="submit"
              className="bg-[#02066F] hover:bg-[#0A1280] text-white"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Create Coupon"}
            </Button>
          </div>
        </form>

        {/* ✅ Coupon List */}
        {coupons?.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-3 text-left">Code</th>
                  <th className="p-3 text-left">Type</th>
                  <th className="p-3 text-left">Value</th>
                  <th className="p-3 text-left">Used By</th>
                  <th className="p-3 text-left">Usage Count</th>
                  <th className="p-3 text-left">Sales (₹)</th>
                  <th className="p-3 text-left">Expiry</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((c) => (
                  <tr
                    key={c._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-3 font-semibold">{c.code}</td>
                    <td className="p-3 capitalize">{c.discountType}</td>
                    <td className="p-3">
                      {c.discountType === "percentage"
                        ? `${c.discountValue}%`
                        : `₹${c.discountValue}`}
                    </td>
                    <td className="p-3">{c.usedBy?.length || 0} users</td>
                    <td className="p-3">{c.usedCount || 0}</td>
                    <td className="p-3">
                      ₹{(c.totalSales || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="p-3">
                      {new Date(c.expiryDate).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <Button
                        variant="destructive"
                        onClick={() => onDelete(c._id)}
                        disabled={deletingId === c._id}
                      >
                        {deletingId === c._id ? "Deleting..." : "Delete"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-4">
            No coupons created yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
