import { useState, useEffect } from "react";
import { useBannerStore } from "@/store/banner.store";
import HomePageResponsive from "@/components/HomePageResponsive";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { banners, fetchactiveBanners } = useBannerStore();

  useEffect(() => {
    fetchactiveBanners();
  }, []);

  return (
    <HomePageResponsive
      selectedCategory={selectedCategory}
      setSelectedCategory={setSelectedCategory}
      banners={banners}
      fetchactiveBanners={fetchactiveBanners}
    />
  );
}
