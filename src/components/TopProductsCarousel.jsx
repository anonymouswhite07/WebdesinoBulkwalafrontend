import React, { useEffect } from "react";
import { useProductStore } from "@/store/product.store";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useNavigate } from "react-router-dom";

export default function TopProductsCarousel() {
  const { products, fetchProducts, loading, error } = useProductStore();
  const navigate = useNavigate();

  // ✅ Fetch featured products
  useEffect(() => {
    fetchProducts({ isFeatured: true, limit: 10 });
  }, [fetchProducts]);

  if (loading)
    return (
      <div className="flex justify-center py-12 sm:py-16 text-gray-500 text-sm sm:text-base">
        Loading top products...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center py-12 sm:py-16 text-red-500 text-sm sm:text-base">
        Failed to load featured products.
      </div>
    );

  if (!products || products.length === 0)
    return (
      <div className="flex justify-center py-12 sm:py-16 text-gray-500 text-sm sm:text-base">
        No top products found.
      </div>
    );

  return (
    <section className="relative max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-10">
      {/* ✅ Header */}
      <div className="flex justify-between items-center mb-4 sm:mb-8">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">
          Top Products
        </h2>
        <div className="hidden sm:block h-[2px] w-16 sm:w-24 bg-[#02066F]" />
      </div>

      {/* ✅ Carousel */}
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
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        pagination={{ clickable: true, dynamicBullets: true }}
        // navigation
        loop={true}
        className="pb-10 sm:pb-12"
      >
        {products.map((product) => (
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
              {/* 🔹 Product Image */}
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
                <span
                  className="
                    absolute top-2 sm:top-3 left-2 sm:left-3 
                    bg-yellow-400 text-[#02066F] 
                    text-[10px] sm:text-xs font-semibold 
                    px-2 sm:px-3 py-[2px] sm:py-1 
                    rounded-full shadow-sm
                  "
                >
                  Featured
                </span>
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
    </section>
  );
}
