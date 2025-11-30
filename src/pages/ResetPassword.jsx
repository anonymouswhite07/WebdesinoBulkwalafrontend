import React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { ResetPasswordSchema } from "@/schemas/userSchema.js";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import useAuthStore from "@/store/auth.store";

const ResetPassword = () => {
  const { resetPassword, isLoading } = useAuthStore();
  const { userid, token } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(ResetPasswordSchema),
  });

  const onSubmit = async (data) => {
    const { newPassword } = data;
    const res = await resetPassword({ userid, token, newPassword });

    if (res.success) {
      toast.success("Password successfully reset!");
      navigate("/login");
    } else {
      toast.error(res.error || "Failed to reset password");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-lg border border-gray-200 rounded-2xl bg-white">
        {/* Header */}
        <CardHeader className="text-center space-y-2 pt-6">
          <CardTitle className="text-2xl sm:text-3xl font-semibold text-[#02066F]">
            Reset Your Password
          </CardTitle>
          <CardDescription className="text-gray-500 text-sm sm:text-base">
            Enter your new password and confirm it below.
          </CardDescription>
        </CardHeader>

        {/* Form */}
        <CardContent className="p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* New Password */}
            <div>
              <label
                htmlFor="newPassword"
                className="block text-gray-700 font-medium mb-2"
              >
                New Password
              </label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Enter new password"
                {...register("newPassword")}
                className="rounded-lg border-gray-300 focus:ring-2 focus:ring-[#02066F] transition-all"
              />
              {errors.newPassword && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.newPassword.message}
                </span>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-gray-700 font-medium mb-2"
              >
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                {...register("confirmPassword")}
                className="rounded-lg border-gray-300 focus:ring-2 focus:ring-[#02066F] transition-all"
              />
              {errors.confirmPassword && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-[#02066F] hover:bg-[#04127A] text-white font-semibold rounded-lg py-2.5 mt-2 transition-all"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting || isLoading ? "Resetting..." : "Reset Password"}
            </Button>

            {/* Back to Login */}
            <p className="text-center text-sm text-gray-600 mt-4">
              Back to{" "}
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

export default ResetPassword;
