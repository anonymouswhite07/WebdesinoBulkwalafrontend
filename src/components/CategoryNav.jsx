import { useEffect } from "react";
import { useCategoryStore } from "@/store/category.store";

export default function CategoryNav({ selectedCategory, onSelect }) {
  const { categories, fetchCategories, loading } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  if (loading)
    return <p className="text-center text-gray-500 py-3">Loading...</p>;

  return (
    <div
      className="
        flex 
        items-center
        gap-3 
        md:gap-5 
        overflow-x-auto 
        px-3 
        py-2 
        md:px-6 md:py-3 
        bg-white 
        border-b border-gray-200
        scrollbar-hide 
        sticky top-0 z-30
      "
    >
      {categories.map((cat) => {
        const isSelected = selectedCategory?._id === cat._id;

        return (
          <div
            key={cat._id}
            className="
              flex flex-col items-center 
              min-w-[60px] 
              md:min-w-[80px] 
              cursor-pointer 
              transition-all 
              duration-200 
              active:scale-95
            "
            onClick={() => onSelect(cat)}
          >
            <div
              className={`
                w-12 h-12 
                md:w-16 md:h-16 
                rounded-md 
                overflow-hidden 
                flex items-center justify-center 
                border-2 
                transition-all duration-200 
                ${
                  isSelected
                    ? "border-blue-600 scale-105"
                    : "border-transparent hover:border-blue-300"
                }
              `}
            >
              <img
                src={cat.img_url || cat.image}
                alt={cat.name}
                className="w-full h-full object-cover"
              />
            </div>

            <p
              className={`
                text-[10px] md:text-sm mt-1 md:mt-2 
                font-medium text-center leading-tight
                ${isSelected ? "text-blue-600" : "text-gray-700"}
                truncate max-w-[60px] md:max-w-[90px]
              `}
            >
              {cat.name}
            </p>
          </div>
        );
      })}
    </div>
  );
}
