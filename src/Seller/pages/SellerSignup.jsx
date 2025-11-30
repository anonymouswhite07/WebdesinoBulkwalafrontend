import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import useAuthStore from "@/store/auth.store.js";
import { SellerSignupSchema } from "@/schemas/userSchema.js";

const SellerSignup = () => {
  const form = useForm({
    resolver: zodResolver(SellerSignupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      businessName: "",
      gstNumber: "",
      pickupAddress: "",
      bankName: "",
      accountNumber: "",
      ifsc: "",
    },
  });

  const { user, isLoggedIn, sellerSignup } = useAuthStore();
  const navigate = useNavigate();
  // 👇 Check login and role
  useEffect(() => {
    if (isLoggedIn && user) {
      if (user.role === "seller") {
        toast.info("You are already a registered seller!");
        navigate("/seller");
      } else if (user.role === "customer") {
        toast.info("You already have an account. Apply from your profile.");
        navigate("/profile");
      }
    }
  }, [isLoggedIn, user, navigate]);

  const onSubmit = async (values) => {
    const res = await sellerSignup(values);
    if (res.success && res.user?._id) {
      toast.success("Seller account created! Please verify your email.");
      form.reset();
      navigate(`/verify/${res.user._id}`);
    } else {
      toast.error(res.error || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start pt-32 pb-16 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-2xl shadow-lg border border-gray-200 rounded-2xl bg-white">
        <CardContent className="p-6 sm:p-8">
          <h2 className="text-center text-2xl sm:text-3xl font-semibold text-[#02066F] mb-8">
            Become a Seller
          </h2>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 sm:space-y-7"
            >
              {/* Personal Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your full name"
                          {...field}
                          className="rounded-lg focus:ring-2 focus:ring-[#02066F]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your email"
                          type="email"
                          {...field}
                          className="rounded-lg focus:ring-2 focus:ring-[#02066F]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter a strong password"
                          {...field}
                          className="rounded-lg focus:ring-2 focus:ring-[#02066F]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Phone</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="9876543210"
                          {...field}
                          className="rounded-lg focus:ring-2 focus:ring-[#02066F]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Business Info */}
              <h3 className="text-xl font-semibold text-[#02066F] mt-4">
                Business Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <FormField
                  control={form.control}
                  name="businessName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">
                        Business Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your business name"
                          {...field}
                          className="rounded-lg focus:ring-2 focus:ring-[#02066F]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gstNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">
                        GST Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Optional"
                          {...field}
                          className="rounded-lg focus:ring-2 focus:ring-[#02066F]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pickupAddress"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel className="text-gray-700">
                        Pickup Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Complete pickup address"
                          {...field}
                          className="rounded-lg focus:ring-2 focus:ring-[#02066F]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Bank Info */}
              <h3 className="text-xl font-semibold text-[#02066F] mt-4">
                Bank Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <FormField
                  control={form.control}
                  name="bankName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Bank Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="HDFC Bank"
                          {...field}
                          className="rounded-lg focus:ring-2 focus:ring-[#02066F]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="accountNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">
                        Account Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="1234567890"
                          {...field}
                          className="rounded-lg focus:ring-2 focus:ring-[#02066F]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ifsc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">IFSC Code</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="HDFC0001234"
                          {...field}
                          className="rounded-lg focus:ring-2 focus:ring-[#02066F]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="w-full mt-6 bg-[#02066F] hover:bg-[#04127A] text-white font-semibold rounded-lg py-2.5 transition-all"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting
                  ? "Submitting..."
                  : "Register as Seller"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SellerSignup;
