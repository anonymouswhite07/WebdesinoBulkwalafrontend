import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { referralSchema } from "@/schemas/referralSchema";
import { useReferralStore } from "@/store/referral.store";
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

export default function ReferralManager() {
  const {
    referrals,
    fetchReferrals,
    createReferral,
    deleteReferral,
    isLoading,
  } = useReferralStore();

  const [deletingId, setDeletingId] = useState(null);

  const form = useForm({ resolver: zodResolver(referralSchema) });

  useEffect(() => {
    fetchReferrals();
  }, []);

  const onSubmit = async (data) => {
    const res = await createReferral(data);
    if (res.success) {
      toast.success("Referral created successfully!");
      form.reset();
      fetchReferrals();
    } else toast.error(res.message || "Failed to create referral");
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    const res = await deleteReferral(id);
    setDeletingId(null);
    if (res.success) {
      toast.success("Referral deleted successfully!");
      fetchReferrals();
    } else toast.error(res.message || "Failed to delete referral");
  };

  return (
    <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-[#02066F] font-semibold">
          Referral Management
        </CardTitle>
        <CardDescription>
          Assign referral codes to influencers for audience discounts.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* ✅ Create Referral Form */}
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
        >
          <Input
            placeholder="Influencer Email"
            {...form.register("influencerEmail")}
          />
          <Input placeholder="Referral Code" {...form.register("code")} />
          <Input
            type="number"
            placeholder="Discount %"
            {...form.register("discountPercent")}
          />
          <div className="col-span-full flex justify-end">
            <Button
              type="submit"
              className="bg-[#02066F] hover:bg-[#0A1280] text-white"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Create Referral"}
            </Button>
          </div>
        </form>

        {/* ✅ Referrals Table */}
        {referrals?.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-3 text-left">Influencer</th>
                  <th className="p-3 text-left">Referral Code</th>
                  <th className="p-3 text-left">Discount</th>
                  <th className="p-3 text-left">Used By</th>
                  <th className="p-3 text-left">Usage Count</th>
                  <th className="p-3 text-left">Total Sales (₹)</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {referrals.map((r) => (
                  <tr
                    key={r._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-3">
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {r.influencer?.name || "—"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {r.influencer?.email || "—"}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 font-semibold">{r.code}</td>
                    <td className="p-3">{r.discountPercent}%</td>
                    <td className="p-3">{r.usedBy?.length || 0} users</td>
                    <td className="p-3">{r.usageCount || 0}</td>
                    <td className="p-3">
                      ₹{(r.totalSales || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="p-3">
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(r._id)}
                        disabled={deletingId === r._id}
                      >
                        {deletingId === r._id ? "Deleting..." : "Delete"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-4">No referrals yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
