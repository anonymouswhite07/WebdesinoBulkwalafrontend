import React, { useEffect } from "react";
import { useProductStore } from "@/store/product.store";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useNavigate } from "react-router-dom";

export default function RecentProductsCarousel() {
  const { products, fetchProducts, loading, error } = useProductStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts({ limit: 10, sort: "-createdAt" });
  }, [fetchProducts]);

  if (loading)
    return (
      <div className="flex justify-center py-12 sm:py-16 text-gray-500 text-sm sm:text-base">
        Loading latest products...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center py-12 sm:py-16 text-red-500 text-sm sm:text-base">
        Failed to load products.
      </div>
    );

  if (!products || products.length === 0)
    return (
      <div className="flex justify-center py-12 sm:py-16 text-gray-500 text-sm sm:text-base">
        No products found.
      </div>
    );

  return (
    <section className="relative max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-10">
      {/* ✅ Header */}
      <div className="flex justify-between items-center mb-4 sm:mb-8">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">
          Newly Launched Products
        </h2>
        <div className="hidden sm:block h-[2px] w-16 sm:w-24 bg-[#02066F]" />
      </div>

      {/* ✅ Carousel */}
      <div className="relative overflow-visible">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={15}
          slidesPerView={1}
          breakpoints={{
            480: { slidesPerView: 2, spaceBetween: 20 },
            768: { slidesPerView: 3, spaceBetween: 25 },
            1024: { slidesPerView: 4, spaceBetween: 30 },
            1280: { slidesPerView: 5, spaceBetween: 35 },
          }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true, dynamicBullets: true }}
          // navigation
          loop={true}
          className="pb-10 sm:pb-12"
        >
          {products.slice(0, 10).map((product) => (
            <SwiperSlide key={product._id}>
              <div
                className="
                  bg-white rounded-lg shadow-sm hover:shadow-md 
                  transition-all duration-300 
                  overflow-hidden group cursor-pointer 
                  border border-gray-100 flex flex-col 
                  h-[300px] sm:h-[340px] md:h-[380px]
                "
              >
                {/* 🔹 Image Section */}
                <div
                  className="
                    relative w-full 
                    h-[150px] sm:h-[170px] md:h-[200px] 
                    bg-gray-50 
                    overflow-hidden 
                    flex items-center justify-center
                  "
                  onClick={() => navigate(`/product/${product.slug}`)}
                >
                  <img
                    src={
                      product.images?.[0] ||
                      "https://ik.imagekit.io/bulkwala/demo/default-product.png"
                    }
                    alt={product.title}
                    className="
                      object-contain w-full h-full 
                      group-hover:scale-105 
                      transition-transform duration-300
                    "
                  />
                </div>

                {/* 🔹 Product Info */}
                <div className="p-3 sm:p-4 flex flex-col justify-between flex-grow">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-1">
                    {product.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 mt-1">
                    {product.description?.slice(0, 60) || "No description"}
                  </p>

                  <div className="flex justify-between items-center mt-2 sm:mt-3">
                    <span className="text-sm sm:text-lg font-bold text-[#02066F]">
                      ₹
                      {product.discountPrice && product.discountPrice > 0
                        ? product.discountPrice
                        : product.price}
                    </span>

                    <button
                      onClick={() => navigate(`/product/${product.slug}`)}
                      className="
                        text-xs sm:text-sm font-semibold text-yellow-500 
                        hover:text-yellow-400 transition-colors
                      "
                    >
                      View Details ›
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
