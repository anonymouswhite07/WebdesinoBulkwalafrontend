import React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgotPasswordSchema } from "@/schemas/userSchema";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@/store/auth.store";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { forgetPassword, isLoading } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    const { email } = data;
    const res = await forgetPassword(email);

    if (res.success) {
      toast.success("Password reset link sent to your email!");
      navigate("/login");
    } else {
      toast.error(res.error || "Failed to send reset link");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-lg border border-gray-200 rounded-2xl bg-white">
        <CardHeader className="text-center space-y-2 pt-6">
          <CardTitle className="text-2xl sm:text-3xl font-semibold text-[#02066F]">
            Forgot Password?
          </CardTitle>
          <CardDescription className="text-gray-500 text-sm sm:text-base">
            Enter your registered email address and we’ll send you a reset link.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-2"
              >
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                className="rounded-lg border-gray-300 focus:ring-2 focus:ring-[#02066F] transition-all"
              />
              {errors.email && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-[#02066F] hover:bg-[#04127A] text-white font-semibold rounded-lg py-2.5 mt-2 transition-all"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting || isLoading ? "Sending..." : "Send Reset Link"}
            </Button>

            {/* Back to Login */}
            <p className="text-center text-sm text-gray-600 mt-4">
              Remember your password?{" "}
              <span
                className="text-[#02066F] font-medium cursor-pointer hover:underline"
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
