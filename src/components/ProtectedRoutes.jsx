import React from "react";
import { Navigate } from "react-router-dom";
import useAuthStore from "@/store/auth.store";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ProtectedRoutes({ children, allowedRoles }) {
  const user = useAuthStore((state) => state.user);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const isLoading = useAuthStore((state) => state.isLoading);

  // show loader only when first checking
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-white text-[#02066F]">
        <Loader2 className="animate-spin w-10 h-10 mb-3 text-[#02066F]" />
        <p className="text-base font-medium">Checking authentication...</p>
      </div>
    );
  }

  //  if not logged in
  if (!isLoggedIn || !user) {
    toast.dismiss();
    toast.error("You must be logged in to access this page.");
    return <Navigate to="/login" replace />;
  }

  //  if role not allowed
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    toast.dismiss();
    toast.error("You do not have permission to view this page.");
    return <Navigate to="/" replace />;
  }

  // render children safely
  return <>{children}</>;
}
