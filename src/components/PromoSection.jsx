import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function PromoSection() {
  const promos = [
    {
      id: 1,
      title: "Bulk Orders Available",
      btn: "SHOP NOW",
      img: "https://ik.imagekit.io/bulkwala/demo/bannerimg3.png?updatedAt=1762846062182",
      large: true,
    },
    {
      id: 2,
      title: "Ensure Best Quality Products",
      subtitle: "Premium quality you can trust.",
      img: "https://ik.imagekit.io/bulkwala/demo/bannerimg2.png?updatedAt=1762846061703",
    },
    {
      id: 3,
      title: "Trustworthy Shop by Our Client",
      subtitle: "Delivering satisfaction and trust every day.",
      img: "https://ik.imagekit.io/bulkwala/demo/bannerimg1.png?updatedAt=1762846061563",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto py-10 px-4 md:px-0">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Left Large Banner */}
        <div className="md:col-span-2">
          <img
            src={promos[0].img}
            alt={promos[0].title}
            className="w-full h-auto rounded-2xl object-cover shadow-md hover:shadow-lg transition-all duration-300"
          />
          <div className="flex justify-between items-center mt-4">
            <h2 className="text-2xl md:text-3xl font-bold text-[#02066F]">
              {promos[0].title}
            </h2>
            <Link to="/products">
              <Button className="bg-[#FFD700] text-[#02066F] font-semibold hover:bg-[#E5C870]">
                {promos[0].btn}
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Two Smaller Sections */}
        <div className="flex flex-col gap-6">
          {promos.slice(1).map((item) => (
            <div key={item.id} className="text-center">
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-[180px] md:h-[200px] rounded-2xl object-contain shadow-sm hover:shadow-md transition-all duration-300"
              />
              <h3 className="text-lg md:text-xl font-semibold text-[#02066F] mt-2">
                {item.title}
              </h3>
              {item.subtitle && (
                <p className="text-gray-500 text-sm mt-1">{item.subtitle}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
