import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { offerSchema } from "@/schemas/offerSchema";
import { useOfferStore } from "@/store/offer.store";
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

export default function OfferManager() {
  const { activeOffer, fetchActiveOffer, startOffer, deleteOffer, isLoading } =
    useOfferStore();
  const form = useForm({ resolver: zodResolver(offerSchema) });
  const [countdown, setCountdown] = useState("");

  // 🧭 Fetch and auto-refresh every 10 seconds
  useEffect(() => {
    fetchActiveOffer();
    const interval = setInterval(() => {
      fetchActiveOffer();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // ⏳ Countdown timer (updates every second)
  useEffect(() => {
    if (!activeOffer?.isActive || !activeOffer?.expiresAt) {
      setCountdown("");
      return;
    }

    const updateCountdown = () => {
      const now = new Date().getTime();
      const end = new Date(activeOffer.expiresAt).getTime();
      const remaining = Math.max(0, end - now);

      const minutes = Math.floor(remaining / 60000);
      const seconds = Math.floor((remaining % 60000) / 1000);

      if (remaining <= 0) {
        setCountdown("Expired");
      } else {
        setCountdown(
          `${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`
        );
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [activeOffer]);

  const onSubmit = async (data) => {
    const res = await startOffer(data);
    if (res.success) {
      toast.success("15-minute offer activated!");
      fetchActiveOffer();
    } else toast.error(res.message || "Failed to activate offer");
  };

  const handleDeleteOffer = async () => {
    const res = await deleteOffer();
    if (res.success) {
      toast.success("Offer deleted successfully!");
      fetchActiveOffer();
    } else toast.error("Failed to delete offer");
  };

  return (
    <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-[#02066F]">Flash Offer (15-Min)</CardTitle>
        <CardDescription>
          Start a limited-time 15-minute offer with a global discount.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Form */}
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col md:flex-row md:items-start gap-4 mb-6"
        >
          {/* Discount Field */}
          <div className="w-full md:w-1/3 flex flex-col">
            <Input
              type="number"
              placeholder="Discount % (e.g. 90)"
              {...form.register("discountPercent")}
              className={`w-full ${
                form.formState.errors.discountPercent ? "border-red-500" : ""
              }`}
            />
            {form.formState.errors.discountPercent && (
              <p className="text-red-500 text-sm mt-1 animate-fadeIn">
                {form.formState.errors.discountPercent.message}
              </p>
            )}
          </div>

          {/* Max Discount Field */}
          <div className="w-full md:w-1/3 flex flex-col">
            <Input
              type="number"
              placeholder="Max Discount ₹ (e.g. 50)"
              {...form.register("maxDiscountAmount")}
              className={`w-full ${
                form.formState.errors.maxDiscountAmount ? "border-red-500" : ""
              }`}
            />
            {form.formState.errors.maxDiscountAmount && (
              <p className="text-red-500 text-sm mt-1 animate-fadeIn">
                {form.formState.errors.maxDiscountAmount.message}
              </p>
            )}
          </div>

          {/* Button */}
          <div className="w-full md:w-auto flex items-center mt-1 md:mt-0">
            <Button
              type="submit"
              className="bg-[#02066F] hover:bg-[#0A1280] text-white w-full md:w-auto"
              disabled={isLoading}
            >
              {isLoading ? "Activating..." : "Start 15-Min Offer"}
            </Button>
          </div>
        </form>

        {/* Active Offer Section */}
        {activeOffer && activeOffer.isActive ? (
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-center transition-all duration-300">
            <h3 className="text-lg font-semibold text-green-700">
              Active Offer: {activeOffer.discountPercent}% OFF up to ₹
              {activeOffer.maxDiscountAmount}
            </h3>

            <p className="text-sm text-gray-700 mt-2">
              ⏳ Ends in:{" "}
              <span className="font-semibold text-green-700">
                {countdown === "Expired" ? "Expired" : countdown}
              </span>
            </p>

            <p className="text-xs text-gray-500 mt-1">
              Ends at:{" "}
              {activeOffer.expiresAt
                ? new Date(activeOffer.expiresAt).toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Invalid Date"}
            </p>

            <Button
              onClick={handleDeleteOffer}
              disabled={isLoading}
              className="mt-3 bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Offer
            </Button>
          </div>
        ) : (
          // Inactive Offer Section
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-center transition-all duration-300">
            <h3 className="text-lg font-semibold text-yellow-700">
              🚫 No Active Offer
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Start a new 15-minute flash sale by setting discount values above.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
