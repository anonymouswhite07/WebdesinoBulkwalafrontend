import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ResponsiveContainer, ResponsiveGrid, ResponsiveText, ResponsiveButton } from "@/components/ResponsiveUtils";

const FooterResponsive = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Subscribed with email:", email);
    setEmail("");
  };

  return (
    <footer className="w-full bg-gray-100 border-t border-gray-300 pt-8 sm:pt-10 pb-6 sm:pb-8">
      <ResponsiveContainer>
        {/* Main Footer Content */}
        <div className="footer-responsive">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img
                src="https://ik.imagekit.io/bulkwala/demo/bulkwalalogo.jpg?updatedAt=1762145179195"
                alt="Bulkwala Logo"
                className="w-12 h-12 sm:w-16 sm:h-16"
              />
              <ResponsiveText size="xl" weight="bold" color="text-[#02066F]">
                Bulkwala
              </ResponsiveText>
            </div>
            <p className="text-gray-600 text-sm sm:text-base">
              Your trusted partner for bulk purchasing needs. Quality products at wholesale prices.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <ResponsiveText size="lg" weight="semibold" color="text-[#02066F]" className="mb-4">
              Quick Links
            </ResponsiveText>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-[#02066F] text-sm sm:text-base">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-600 hover:text-[#02066F] text-sm sm:text-base">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-[#02066F] text-sm sm:text-base">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-[#02066F] text-sm sm:text-base">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <ResponsiveText size="lg" weight="semibold" color="text-[#02066F]" className="mb-4">
              Customer Service
            </ResponsiveText>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-[#02066F] text-sm sm:text-base">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/shipping-policy" className="text-gray-600 hover:text-[#02066F] text-sm sm:text-base">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/refund-and-return-policy" className="text-gray-600 hover:text-[#02066F] text-sm sm:text-base">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-gray-600 hover:text-[#02066F] text-sm sm:text-base">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <ResponsiveText size="lg" weight="semibold" color="text-[#02066F]" className="mb-4">
              Newsletter
            </ResponsiveText>
            <p className="text-gray-600 text-sm sm:text-base mb-3">
              Subscribe to get special offers and updates
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-md text-sm sm:text-base"
                required
              />
              <ResponsiveButton type="submit" size="sm" fullWidth>
                Subscribe
              </ResponsiveButton>
            </form>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="flex justify-center space-x-6 my-8 sm:my-10">
          <a href="#" className="text-gray-600 hover:text-[#02066F]">
            <ion-icon name="logo-facebook" class="text-xl sm:text-2xl"></ion-icon>
          </a>
          <a href="#" className="text-gray-600 hover:text-[#02066F]">
            <ion-icon name="logo-twitter" class="text-xl sm:text-2xl"></ion-icon>
          </a>
          <a href="#" className="text-gray-600 hover:text-[#02066F]">
            <ion-icon name="logo-instagram" class="text-xl sm:text-2xl"></ion-icon>
          </a>
          <a href="#" className="text-gray-600 hover:text-[#02066F]">
            <ion-icon name="logo-linkedin" class="text-xl sm:text-2xl"></ion-icon>
          </a>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-300 pt-6 sm:pt-8 text-center">
          <p className="text-gray-600 text-sm sm:text-base">
            © {new Date().getFullYear()} Bulkwala. All rights reserved.
          </p>
        </div>
      </ResponsiveContainer>
    </footer>
  );
};

export default FooterResponsive;