import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Building2,
  Users,
  Globe,
  Truck,
  CheckCircle,
  HeartHandshake,
  ShieldCheck,
} from "lucide-react";

export default function About() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#02066F] to-[#243b6b] text-white py-20 mb-16 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/white-wall.png')]"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold tracking-tight mb-4">
            About <span className="text-[#C9E0EF]">Bulkwala.com</span>
          </h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto leading-relaxed">
            Empowering India’s local businesses and customers through digital
            access, affordability, and trust since 2017.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6">
        {/* About Story */}
        <Card className="border-gray-200 shadow-md mb-16">
          <CardHeader>
            <CardTitle className="text-3xl font-semibold text-[#02066F]">
              Our Story
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700 leading-relaxed space-y-4 text-lg">
            <p>
              Founded in <strong>2017</strong> by{" "}
              <strong>Azad Kumar Jha</strong>,<strong> Bulkwala.com</strong> is
              a proud initiative of <strong>Awesome Accessories</strong>,
              headquartered in Delhi, India. What began as a humble street
              vending journey has evolved into one of India’s fastest-growing
              digital marketplaces — bridging the gap between bulk and retail
              shopping across the nation.
            </p>
            <p>
              As a homegrown e-commerce platform, Bulkwala.com is driven by a
              vision to empower local businesses, shopkeepers, and customers
              through digital access, affordability, and trust. Our mission is
              to create a sustainable and inclusive ecosystem where every seller
              and buyer can grow together.
            </p>
            <p>
              We believe in the spirit of innovation, resilience, and progress.
              Every challenge inspires us to learn, improve, and deliver better
              experiences to our users. By combining technology with
              customer-first values, Bulkwala.com continues to connect{" "}
              <em>“Bharat with India”</em> — enabling seamless commerce for
              everyone, everywhere.
            </p>
            <p>
              At Bulkwala.com, customer satisfaction is our top priority. Our
              dedicated support team, secure checkout process, and fast delivery
              network work together to provide a smooth and reliable shopping
              experience — every time you shop.
            </p>
            <p>
              Whether you’re upgrading your wardrobe, decorating your home, or
              finding the perfect gift — we’re here to make it happen with
              style, trust, and confidence.
            </p>
          </CardContent>
        </Card>

        {/* Why Choose Us Section */}
        <Card className="shadow-md border-gray-200 mb-20">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-semibold text-[#02066F]">
              Why Choose <span className="text-[#1E40AF]">Bulkwala.com</span>?
            </CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              Discover what makes us India’s trusted online wholesale platform.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 px-8 py-8">
            {[
              {
                icon: <ShieldCheck className="w-8 h-8 text-[#02066F]" />,
                text: "100% Genuine & Verified Products",
              },
              {
                icon: <HeartHandshake className="w-8 h-8 text-[#02066F]" />,
                text: "Easy Returns & Hassle-Free Refunds",
              },
              {
                icon: <CheckCircle className="w-8 h-8 text-[#02066F]" />,
                text: "Safe & Secure Payments (Razorpay / Paytm / UPI / Cards)",
              },
              {
                icon: <Truck className="w-8 h-8 text-[#02066F]" />,
                text: "Fast Pan-India Delivery",
              },
              {
                icon: <Users className="w-8 h-8 text-[#02066F]" />,
                text: "24×7 Customer Support",
              },
              {
                icon: <Globe className="w-8 h-8 text-[#02066F]" />,
                text: "Trusted by thousands of happy customers across India",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-all cursor-pointer"
              >
                {item.icon}
                <p className="text-gray-700 text-sm leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Closing Section */}
        <div className="text-center py-12">
          <Building2 className="w-14 h-14 text-[#02066F] mx-auto mb-4" />
          <h2 className="text-3xl font-semibold text-[#02066F] mb-2">
            Join the <span className="text-[#1E40AF]">BulkWala</span> Community
            🚀
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed text-base">
            Be a part of India’s growing digital marketplace. Whether you're a
            seller, a business owner, or a customer — Bulkwala.com is your
            destination for quality, trust, and growth.
          </p>
        </div>
      </div>
    </section>
  );
}
