import React from 'react';
import { ResponsiveContainer, ResponsiveGrid, ResponsiveCard, ResponsiveText } from './ResponsiveUtils';
import CategoryNav from "./CategoryNav.jsx";
import CategorySlider from "./CategorySlider.jsx";
import SubcategoryList from "./SubcategoryList.jsx";
import PromoSection from "@/components/PromoSection.jsx";
import RecentProductsCarousel from "@/components/RecentProductsCarousel.jsx";
import TopProductsCarousel from "@/components/TopProductsCarousel.jsx";

const HomePageResponsive = ({ 
  selectedCategory, 
  setSelectedCategory, 
  banners,
  fetchactiveBanners
}) => {
  // Using responsive components for better layout control
  return (
    <div className="w-full">
      {/* 🔹 Category Navigation - Full width with responsive padding */}
      <section className="w-full py-6 sm:py-8">
        <ResponsiveContainer>
          <CategoryNav
            selectedCategory={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </ResponsiveContainer>
      </section>

      {/* 🔹 Category Slider - Full width with responsive padding */}
      <section className="w-full">
        <ResponsiveContainer>
          <CategorySlider category={selectedCategory} defaultBanners={banners} />
        </ResponsiveContainer>
      </section>

      {/* 🔹 Subcategories - Full width with responsive padding */}
      <section className="w-full py-4 sm:py-6">
        <ResponsiveContainer>
          <SubcategoryList category={selectedCategory} />
        </ResponsiveContainer>
      </section>

      {/* 🔹 Recent Products - Full width with responsive padding */}
      <section className="w-full py-4 sm:py-6">
        <ResponsiveContainer>
          <RecentProductsCarousel />
        </ResponsiveContainer>
      </section>

      {/* 🔹 Promo Section - Full width */}
      <section className="w-full">
        <PromoSection />
      </section>

      {/* 🔹 Top Products - Full width with responsive padding */}
      <section className="w-full py-4 sm:py-6">
        <ResponsiveContainer>
          <TopProductsCarousel />
        </ResponsiveContainer>
      </section>
    </div>
  );
};

export default HomePageResponsive;