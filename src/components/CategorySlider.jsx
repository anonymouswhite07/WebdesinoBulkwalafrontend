import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useState } from 'react';

export default function CategorySlider({ category, defaultBanners }) {
  const activeBannerSet = defaultBanners?.find((b) => b.isActive);
  const [failedImages, setFailedImages] = useState(new Set()); // Track failed images

  const images = category?.banner?.length
    ? category.banner
    : activeBannerSet?.images?.length
    ? activeBannerSet.images
    : [
        'https://ik.imagekit.io/bulkwala/Banner/Banner.png',
        'https://ik.imagekit.io/bulkwala/Banner/Phone%20Cover%20Banner.png',
        'https://ik.imagekit.io/bulkwala/Banner/Accessories.png',
      ];

  // Filter out failed images
  const validImages = images.filter((img) => !failedImages.has(img));

  // Handle image load error
  const handleImageError = (imgUrl) => {
    setFailedImages((prev) => new Set([...prev, imgUrl]));
    if (import.meta.env.DEV) {
      console.warn(`Failed to load banner image: ${imgUrl}`);
    }
  };

  // Don't render if no valid images
  if (validImages.length === 0) {
    return (
      <div className="w-full h-[200px] bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500 text-sm">No banner images available</p>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation={{
          nextEl: '.custom-next',
          prevEl: '.custom-prev',
        }}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={validImages.length > 1} // Only loop if more than 1 image
        className="w-full rounded-lg overflow-hidden"
      >
        {validImages.map((img, idx) => (
          <SwiperSlide key={idx}>
            <img
              src={img}
              alt={`banner-${idx}`}
              onError={() => handleImageError(img)}
              className="w-full h-auto max-h-[180px] sm:max-h-[250px] md:max-h-[400px] lg:max-h-[500px] xl:max-h-[550px] object-contain rounded-lg"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* ✅ Custom Navigation Arrows */}
      <button className="custom-prev absolute top-1/2 left-3 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-white/90 hover:bg-white rounded-full shadow-md flex items-center justify-center text-2xl md:text-3xl font-extrabold text-black transition-all duration-300">
        ‹
      </button>

      <button className="custom-next absolute top-1/2 right-3 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-white/90 hover:bg-white rounded-full shadow-md flex items-center justify-center text-2xl md:text-3xl font-extrabold text-black transition-all duration-300">
        ›
      </button>
    </div>
  );
}
