import React, { useEffect, useState } from "react";
import { useProductStore } from "../store/product.store.js";
import { useCategoryStore } from "../store/category.store.js";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu } from "lucide-react"; // for mobile sidebar toggle icon

const Products = () => {
  const { products, fetchProducts, loading, error, total, limit } =
    useProductStore();
  const { categories, fetchCategories } = useCategoryStore();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const subcategoryFromURL = params.get("subcategory");

  const [filters, setFilters] = useState({
    category: "",
    subcategory: subcategoryFromURL || "",
    search: "",
    minPrice: 0,
    maxPrice: 10000,
    page: 1,
    limit: 20,
  });

  const [sidebarOpen, setSidebarOpen] = useState(false); // 🔹 for mobile toggle

  // Initial fetch
  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // fetchCategories is stable from zustand store

  // ✅ Update filter when user navigates with ?subcategory=Name
  useEffect(() => {
    if (subcategoryFromURL) {
      setFilters((prev) => ({ ...prev, subcategory: subcategoryFromURL }));
    }
  }, [subcategoryFromURL]);

  // Fetch products when filters change
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchProducts(filters);
    }, 300); // wait 300ms after typing stops

    return () => clearTimeout(delay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]); // fetchProducts is stable from zustand store

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const totalPages = Math.ceil(total / limit) || 1;
  const productList = Array.isArray(products) ? products : [];

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-hidden">
        {/* 🔹 Mobile Sidebar Toggle */}
        <div className="lg:hidden fixed top-16 left-4 z-40">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="shadow-md bg-white"
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </Button>
        </div>

        {/* 🔹 Sidebar */}
        <aside
          className={cn(
            "fixed lg:static top-0 left-0 z-30 bg-white border-r p-5 sm:p-6 space-y-6 shadow-lg lg:shadow-sm overflow-y-auto transition-all duration-300 ease-in-out",
            sidebarOpen
              ? "w-3/4 sm:w-1/2 md:w-1/3 translate-x-0"
              : "-translate-x-full lg:translate-x-0 lg:w-1/5"
          )}
        >
          <h2 className="text-lg sm:text-xl font-semibold text-gray-700">
            Filters
          </h2>

          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search" className="text-sm sm:text-base">
              Search
            </Label>
            <Input
              id="search"
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="text-sm sm:text-base"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label className="text-sm sm:text-base">Category</Label>
            <div className="flex flex-col space-y-1 max-h-48 overflow-y-auto">
              {categories.map((cat) => (
                <label
                  key={cat._id}
                  className={cn(
                    "cursor-pointer text-sm p-2 rounded-md hover:bg-gray-100",
                    filters.category === cat._id && "bg-gray-200 font-medium"
                  )}
                  onClick={() =>
                    handleFilterChange(
                      "category",
                      filters.category === cat._id ? "" : cat._id
                    )
                  }
                >
                  {cat.name}
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <Label className="text-sm sm:text-base">
              Price Range: ₹{filters.minPrice} - ₹{filters.maxPrice}
            </Label>
            <Slider
              min={0}
              max={10000}
              step={200}
              value={[filters.minPrice, filters.maxPrice]}
              onValueChange={(val) =>
                setFilters((prev) => ({
                  ...prev,
                  minPrice: val[0],
                  maxPrice: val[1],
                  page: 1,
                }))
              }
            />
          </div>

          <Button
            variant="outline"
            className="w-full mt-4 text-sm sm:text-base"
            onClick={() =>
              setFilters({
                category: "",
                search: "",
                minPrice: 0,
                maxPrice: 10000,
                page: 1,
                limit: 20,
              })
            }
          >
            Clear Filters
          </Button>
        </aside>

        {/* 🔹 Overlay for Mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* 🔹 Product Grid */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50 mt-14 lg:mt-0">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
            Products
          </h2>

          {loading ? (
            <p className="text-sm sm:text-base text-gray-500">
              Loading products...
            </p>
          ) : error ? (
            <p className="text-red-500 text-sm sm:text-base">{error}</p>
          ) : productList.length === 0 ? (
            <p className="text-gray-500 text-sm sm:text-base">
              No products found.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {productList.map((product) => (
                <Card
                  key={product._id}
                  onClick={() => navigate(`/product/${product.slug}`)}
                  className="cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200 border rounded-xl bg-white"
                >
                  <CardContent>
                    {/* 🖼 Product Image */}
                    <div className="w-full h-40 sm:h-48 md:h-56 flex items-center justify-center bg-white rounded-md overflow-hidden">
                      <img
                        src={
                          product.images?.[0] ||
                          "https://ik.imagekit.io/bulkwala/demo/default-product.png"
                        }
                        alt={product.title}
                        className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-105"
                      />
                    </div>

                    {/* 🏷 Title */}
                    <h3 className="truncate text-[#02066F] font-semibold mt-3 text-sm sm:text-base">
                      {product.title}
                    </h3>

                    {/* 💰 Final Selling Price */}
                    <p className="font-semibold mt-2 text-base sm:text-lg text-gray-900">
                      ₹
                      {product.discountPrice && product.discountPrice > 0
                        ? product.discountPrice
                        : product.price}
                    </p>

                    {/* 📝 Description */}
                    <p className="mt-2 text-gray-600 line-clamp-2 text-xs sm:text-sm">
                      {product.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {total > limit && (
            <div className="flex justify-center items-center gap-4 mt-8 sm:mt-10">
              <Button
                variant="outline"
                size="sm"
                disabled={filters.page === 1}
                onClick={() =>
                  setFilters((prev) => ({ ...prev, page: prev.page - 1 }))
                }
              >
                Prev
              </Button>
              <span className="text-sm sm:text-base">
                Page {filters.page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={filters.page === totalPages}
                onClick={() =>
                  setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
                }
              >
                Next
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Products;
