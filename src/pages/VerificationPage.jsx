import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuthStore from "@/store/auth.store.js";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const VerificationPage = () => {
  const [token, setToken] = useState("");
  const { userid } = useParams();
  const navigate = useNavigate();
  const {
    verifyEmail,
    resendVerification,
    isLoading,
    pendingVerificationUser,
  } = useAuthStore();

  useEffect(() => {
    return () => {
      // ✅ Clean up loading state if component unmounts
      useAuthStore.setState({ isLoading: false });
    };
  }, []);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!userid) {
      toast.error("User ID not found in URL.");
      return;
    }

    const res = await verifyEmail({ userid, token });

    if (res.success) {
      toast.success("Email verified successfully! You can now log in.");
      useAuthStore.setState({ isLoading: false });

      navigate("/login");
    } else {
      toast.error(res.error || "Verification failed. Please try again.");
      useAuthStore.setState({ isLoading: false });
    }
  };

  const handleResend = async () => {
    if (!userid) {
      toast.error("User ID not found in URL.");
      return;
    }

    const res = await resendVerification(userid);

    if (res.success) {
      toast.success("New verification code sent! Please check your email.");
    } else {
      toast.error(res.error || "Failed to resend code.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-lg border border-gray-200 rounded-2xl bg-white">
        <CardHeader className="text-center space-y-2 pt-6">
          <CardTitle className="text-2xl sm:text-3xl font-semibold text-[#02066F]">
            Verify Your Email
          </CardTitle>
          <CardDescription className="text-gray-600 text-sm sm:text-base">
            A 6-digit verification code has been sent to{" "}
            <span className="font-medium text-[#02066F]">
              {pendingVerificationUser?.email || "your registered email"}
            </span>
            . Please enter it below to verify your account.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 sm:p-8">
          <form onSubmit={handleVerify} className="space-y-6">
            {/* Token Input */}
            <div>
              <label
                htmlFor="token"
                className="block text-gray-700 font-medium mb-2"
              >
                Verification Code
              </label>
              <Input
                id="token"
                type="text"
                placeholder="Enter 6-digit code"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                maxLength={6}
                className="text-center text-lg tracking-widest rounded-lg border-gray-300 focus:ring-2 focus:ring-[#02066F] transition-all"
                required
              />
            </div>

            {/* Verify Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#02066F] hover:bg-[#04127A] text-white font-semibold rounded-lg py-2.5 mt-2 transition-all"
            >
              {isLoading ? "Verifying..." : "Submit Code"}
            </Button>
          </form>

          {/* Resend Code */}
          <div className="text-center mt-5">
            <p className="text-gray-600 text-sm">
              Didn’t receive the code?{" "}
              <Button
                variant="link"
                onClick={handleResend}
                disabled={isLoading}
                className="text-[#02066F] font-medium hover:underline p-0"
              >
                Resend
              </Button>
            </p>
          </div>

          {/* Back to Login */}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Already verified?{" "}
              <span
                className="text-[#02066F] font-medium cursor-pointer hover:underline"
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerificationPage;
