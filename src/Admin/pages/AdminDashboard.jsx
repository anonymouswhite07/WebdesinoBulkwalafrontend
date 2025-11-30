import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaTags,
  FaList,
  FaUsers,
  FaShoppingCart,
  FaEnvelopeOpenText,
  FaImage,
  FaGift,
  FaClock,
  FaUserFriends,
} from "react-icons/fa";

import DashboardContent from "../components/DashboardContent";
import ProductsContent from "../components/ProductsContent";
import CategoriesContent from "../components/CategoriesContent";
import SubcategoriesContent from "../components/SubcategoriesContent";
import UsersContent from "../components/UsersContent";
import OrdersContent from "../components/OrdersContent";
import QueriesContent from "../components/QueriesContent";
import BannerManager from "../components/BannerManager";
import CouponManager from "../components/CouponManager";
import ReferralManager from "../components/ReferralManager";
import OfferManager from "../components/OfferManager";

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState(
    localStorage.getItem("adminActiveSection") || "Dashboard"
  );

  useEffect(() => {
    localStorage.setItem("adminActiveSection", activeSection);
  }, [activeSection]);

  const menuItems = [
    { name: "Dashboard", icon: <FaTachometerAlt /> },
    { name: "Products", icon: <FaBoxOpen /> },
    { name: "Categories", icon: <FaTags /> },
    { name: "Subcategories", icon: <FaList /> },
    { name: "Users", icon: <FaUsers /> },
    { name: "Orders", icon: <FaShoppingCart /> },
    { name: "Banners", icon: <FaImage /> },
    { name: "Coupons", icon: <FaGift /> },
    { name: "Referrals", icon: <FaUserFriends /> },
    { name: "Offers", icon: <FaClock /> },
    { name: "Queries", icon: <FaEnvelopeOpenText /> },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white shadow-md border-r border-gray-200 transition-all duration-300 flex flex-col`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h1
            className={`${
              sidebarOpen ? "block" : "hidden"
            } text-xl font-bold text-[#02066F]`}
          >
            Bulkwala Admin
          </h1>
          <Button
            size="icon"
            variant="ghost"
            className="hover:bg-gray-100 text-[#02066F]"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? "←" : "→"}
          </Button>
        </div>

        <nav className="flex-1 mt-4 overflow-y-auto space-y-1 px-2">
          {menuItems.map((item) => (
            <Button
              key={item.name}
              variant={activeSection === item.name ? "secondary" : "ghost"}
              className={`w-full justify-start px-4 py-2 text-gray-700 rounded-lg transition-all duration-200 ${
                activeSection === item.name
                  ? "bg-[#02066F] text-white hover:bg-[#04127A]"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => setActiveSection(item.name)}
            >
              <span className="text-lg">{item.icon}</span>
              {sidebarOpen && (
                <span className="ml-3 text-sm font-medium">{item.name}</span>
              )}
            </Button>
          ))}
        </nav>

        <div className="border-t p-4 text-xs text-gray-400 text-center">
          © 2025 Bulkwala
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-8 py-6 overflow-y-auto min-h-screen bg-[#F8FAFC]">
        {/* Section Rendering */}
        <div className="space-y-6">
          {activeSection === "Dashboard" && <DashboardContent />}
          {activeSection === "Products" && <ProductsContent />}
          {activeSection === "Categories" && <CategoriesContent />}
          {activeSection === "Subcategories" && <SubcategoriesContent />}
          {activeSection === "Users" && <UsersContent />}
          {activeSection === "Orders" && <OrdersContent />}
          {activeSection === "Banners" && <BannerManager />}
          {activeSection === "Coupons" && <CouponManager />}
          {activeSection === "Referrals" && <ReferralManager />}
          {activeSection === "Offers" && <OfferManager />}
          {activeSection === "Queries" && <QueriesContent />}
        </div>
      </main>
    </div>
  );
}
