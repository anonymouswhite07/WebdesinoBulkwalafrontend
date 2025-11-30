import { useEffect, useMemo } from "react";
import { useSubcategoryStore } from "@/store/subcategory.store";
import { useNavigate } from "react-router-dom";

export default function SubcategoryList({ category }) {
  const { subcategories, fetchSubcategories, loading } = useSubcategoryStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubcategories();
  }, [fetchSubcategories]);

  // ✅ Filter logic — show all or by selected category
  const filteredSubcategories = useMemo(() => {
    if (!category) return subcategories;
    return subcategories.filter(
      (sub) =>
        sub.category?._id === category._id || sub.category === category._id
    );
  }, [subcategories, category]);

  // ✅ Loading State
  if (loading)
    return (
      <div className="flex justify-center py-10 text-gray-500 text-lg">
        Loading subcategories...
      </div>
    );

  // ✅ No Subcategories Found
  if (!filteredSubcategories || filteredSubcategories.length === 0)
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">
            {category ? `Explore ${category.name}` : "Explore by Subcategories"}
          </h2>
          <div className="hidden sm:block h-[2px] w-16 sm:w-24 bg-[#02066F]" />
        </div>
        <p className="text-gray-500 text-center text-sm sm:text-base">
          {category
            ? "No subcategories found for this category."
            : "No subcategories available right now."}
        </p>
      </div>
    );

  // ✅ Responsive Subcategory List
  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4">
      {/* Heading */}
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">
          {category ? `Explore ${category.name}` : "Explore by Subcategories"}
        </h2>
        <div className="hidden sm:block h-[2px] w-16 sm:w-24 bg-[#02066F]" />
      </div>

      {/* ✅ Subcategory Grid / Scrollable Row */}
      <div
        className="
          flex 
          gap-3 sm:gap-5 md:gap-6 
          overflow-x-auto 
          py-2 sm:py-3 
          px-1 
          scrollbar-hide 
          bg-white 
          rounded-md
        "
      >
        {filteredSubcategories.map((sub) => (
          <div
            key={sub._id}
            onClick={() =>
              navigate(`/products?subcategory=${encodeURIComponent(sub.name)}`)
            }
            className="
              flex flex-col items-center 
              min-w-[60px] sm:min-w-[80px] md:min-w-[100px] 
              cursor-pointer 
              group 
              transition-all duration-200 
              active:scale-95
            "
          >
            <div
              className="
                w-12 h-12 
                sm:w-16 sm:h-16 
                md:w-20 md:h-20 
                rounded-md 
                overflow-hidden 
                flex items-center justify-center 
                border-2 
                border-transparent 
                transition-all 
                duration-300 
                group-hover:border-[#02066F] 
                hover:scale-105 
                bg-white 
                shadow-sm
              "
            >
              <img
                src={sub.img_url || sub.image}
                alt={sub.name}
                className="w-full h-full object-contain"
              />
            </div>
            <p
              className="
                text-[10px] sm:text-xs md:text-sm 
                mt-1 sm:mt-2 
                font-medium 
                text-gray-700 
                group-hover:text-[#02066F] 
                transition-colors 
                text-center 
                truncate 
                max-w-[70px] sm:max-w-[100px]
              "
            >
              {sub.name}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
