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
import useAuthStore from "@/store/auth.store";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangePasswordSchema } from "@/schemas/userSchema.js";

const ChangePassword = () => {
  const { changePassword, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ChangePasswordSchema),
  });

  const handleSubmitPassword = async (data) => {
    const { email } = data;

    const res = await changePassword(email);
    if (res.success) {
      toast.success("Password reset link sent to your email!");
    } else {
      toast.error(res.error || "Failed to send reset link");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg border-none bg-white">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold text-gray-800">
            Change Password
          </CardTitle>
          <CardDescription>
            Enter your registered email to receive a password reset link
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit(handleSubmitPassword)}
            className="space-y-4"
          >
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
                {...register("email")} // Register input with React Hook Form
                className="focus:ring-2 focus:ring-gray-700"
              />
              {errors.email && (
                <span className="text-red-500 text-sm">
                  {errors.email.message}
                </span>
              )}
            </div>

            <Button type="submit" className="w-full mt-2" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>

            <div className="text-center mt-4 text-sm text-gray-500">
              <span>Remembered your password? </span>
              <Button
                type="button"
                variant="link"
                onClick={() => navigate("/login")}
              >
                Go to Login
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangePassword;
