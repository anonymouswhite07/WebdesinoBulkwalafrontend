import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
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
import { LoginSchema } from "@/schemas/userSchema.js";

const Login = () => {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const sendOtp = useAuthStore((s) => s.otpLoginSend);
  const verifyOtp = useAuthStore((s) => s.otpLoginVerify);
  const [loginMode, setLoginMode] = useState("email");
  const [otpSent, setOtpSent] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Email Login form
  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
  });

  // Submit for Email Login
  const onSubmit = async (values) => {
    const res = await login(values);

    if (res.success) {
      toast.success("Login successful!");
      navigate("/");
    } else {
      toast.error(res.error);

      // Handle unverified redirect
      if (res.unverifiedUser?._id) {
        navigate(`/verify/${res.unverifiedUser._id}`);
      }
    }
  };

  // Send OTP
  const handleSendOtp = async () => {
    if (!phone) return toast.error("Enter phone number");
    const res = await sendOtp(phone);
    if (res.success) {
      setOtpSent(true);
      toast.success("OTP sent successfully!");
    } else toast.error(res.error);
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    const res = await verifyOtp({ phone, otp });
    if (res.success) {
      toast.success("Logged in successfully!");
      navigate("/");
    } else toast.error(res.error);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <Card className="w-full max-w-md shadow-lg border border-gray-200 rounded-2xl bg-white">
        <CardContent className="p-6 sm:p-8">
          <h2 className="text-center text-2xl font-semibold text-[#02066F] mb-6">
            {loginMode === "email"
              ? "Login with Email"
              : "Login with Phone Number"}
          </h2>

          {/* Toggle */}
          <div className="flex justify-center mb-6">
            <button
              className={`px-3 py-1 rounded-l-lg border ${
                loginMode === "email"
                  ? "bg-[#02066F] text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
              onClick={() => setLoginMode("email")}
            >
              Email Login
            </button>
            <button
              className={`px-3 py-1 rounded-r-lg border ${
                loginMode === "otp"
                  ? "bg-[#02066F] text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
              onClick={() => setLoginMode("otp")}
            >
              OTP Login
            </button>
          </div>

          {loginMode === "email" ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          {...field}
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
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            {...field}
                            className="pr-10"
                          />
                          <span
                            className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff size={20} />
                            ) : (
                              <Eye size={20} />
                            )}
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-[#02066F] text-white"
                >
                  Login
                </Button>
                {/* Forgot Password Link */}
                <div className="text-center">
                  <span
                    className="text-sm text-[#02066F] cursor-pointer hover:underline"
                    onClick={() => navigate("/forgot-password")}
                  >
                    Forgot Password?
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-sm text-gray-500">
                    Don't have an account?{" "}
                    <span
                      className="text-sm text-[#02066F] cursor-pointer hover:underline"
                      onClick={() => navigate("/signup")}
                    >
                      Sign Up
                    </span>
                  </span>
                </div>
              </form>
            </Form>
          ) : (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <Input
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              {otpSent && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Enter OTP
                  </label>
                  <Input
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
              )}

              {!otpSent ? (
                <Button
                  onClick={handleSendOtp}
                  className="w-full bg-[#02066F] text-white"
                >
                  Send OTP
                </Button>
              ) : (
                <Button
                  onClick={handleVerifyOtp}
                  className="w-full bg-[#02066F] text-white"
                >
                  Verify & Login
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
