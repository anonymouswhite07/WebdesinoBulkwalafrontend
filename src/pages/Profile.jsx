import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Link } from "react-router-dom";

import useAuthStore from "@/store/auth.store.js";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import UpdateProfileDialog from "@/components/UpdateProfileDialog";
import SellerFormDialog from "@/Seller/components/SellerFormDialog";

const Profile = () => {
  const { user, isLoading } = useAuthStore();

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Loading profile...
      </div>
    );

  if (!user)
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        Failed to load profile.
      </div>
    );

  const roleBadges = {
    admin: "bg-green-500 text-white",
    seller: "bg-blue-500 text-white",
    customer: "bg-yellow-500 text-white",
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Profile Card */}
        <Card className="shadow-md border-none bg-white">
          <CardHeader className="flex flex-col items-center text-center">
            <Avatar className="h-28 w-28 mb-4">
              {user.avatar ? (
                <AvatarImage src={user.avatar} alt={user.name} />
              ) : (
                <AvatarFallback className="text-3xl font-semibold bg-gray-200 text-gray-700">
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              )}
            </Avatar>
            <CardTitle className="text-2xl font-semibold text-gray-800">
              {user.name}
            </CardTitle>
            <CardDescription className="text-gray-500 mt-1">
              {user.email}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3 text-gray-700">
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Phone:</span>
              <span>{user.phone || "Not provided"}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Role:</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  roleBadges[user.role]
                }`}
              >
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
              <Link to="/change-password" className="w-full sm:w-1/2">
                <Button variant="outline" className="w-full py-2">
                  Change Password
                </Button>
              </Link>
              <div className="w-full sm:w-1/2">
                <UpdateProfileDialog />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right: Seller / Account Info */}
        <div className="flex flex-col space-y-6">
          {/* Seller Info */}
          <Card className="shadow-md border-none bg-white">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">
                Account Information
              </CardTitle>
              <CardDescription>
                Manage your seller or account details
              </CardDescription>
            </CardHeader>
            <CardContent>
              {user.role === "seller" ? (
                // ✅ Case 1: Active Seller
                <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-green-700 font-medium text-lg">
                    Seller Account Active
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Status:{" "}
                    {user?.sellerDetails?.approved
                      ? "Approved ✅"
                      : "Pending Review ⏳"}
                  </p>
                </div>
              ) : user?.sellerDetails?.businessName &&
                !user?.sellerDetails?.approved ? (
                // ✅ Case 2: Application Sent but Pending
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-yellow-700 font-medium text-lg">
                    Seller Application Sent 🚀
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Status: Pending Admin Approval ⏳
                  </p>
                </div>
              ) : (
                // ✅ Case 3: Regular Customer (Show Button)
                <SellerFormDialog />
              )}
            </CardContent>
          </Card>

          {/* Account Summary */}
          <Card className="shadow-md border-none bg-white">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">
                My Account Summary
              </CardTitle>
              <CardDescription>
                Overview of your account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-gray-700">
              <p className="flex justify-between border-b pb-2">
                <span className="font-medium">Joined On:</span>
                <span>
                  {new Date(user.createdAt).toLocaleDateString() || "N/A"}
                </span>
              </p>
              <p className="flex justify-between border-b pb-2">
                <span className="font-medium">Email Verified:</span>
                <span>{user.isVerified ? "Yes ✅" : "No ❌"}</span>
              </p>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card className="shadow-md border-none bg-white">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">
                Order Summary
              </CardTitle>
              <CardDescription>
                Track your orders and purchase history
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-gray-700">
              <p className="flex justify-between border-b pb-2">
                <span className="font-medium">Total Orders:</span>
                <span>{user.totalOrders || 0}</span>
              </p>
              <p className="flex justify-between border-b pb-2">
                <span className="font-medium">Orders This Month:</span>
                <span>{user.monthlyOrders || 0}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-medium">Total Spent:</span>
                <span>₹{user.totalSpent || 0}</span>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
