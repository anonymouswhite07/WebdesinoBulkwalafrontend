import { useEffect } from "react";
import { useWishlistStore } from "@/store/wishlist.store";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2, XCircle } from "lucide-react";

export default function Wishlist() {
  const {
    wishlist,
    fetchWishlist,
    isLoading,
    clearWishlist,
    removeWishlistItem,
  } = useWishlistStore();
  const navigate = useNavigate();

  // Load wishlist on mount
  useEffect(() => {
    fetchWishlist();
  }, []);

  // Loader
  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500 text-sm sm:text-base">
        Loading wishlist...
      </div>
    );

  // Empty State
  if (wishlist.length === 0)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center px-4 text-gray-600">
        <p className="text-base sm:text-lg font-medium">
          Your wishlist is empty ❤️
        </p>
        <Button
          onClick={() => navigate("/products")}
          className="bg-[#02066F] hover:bg-[#04127A] text-white mt-5 px-6 py-2 w-full sm:w-auto text-sm sm:text-base font-semibold transition-all"
        >
          Browse Products
        </Button>
      </div>
    );

  // ✅ Clear all handler
  const handleClearAll = async () => {
    await clearWishlist();
    toast.info("All items removed from wishlist ❌");
  };

  // ✅ Remove individual item
  const handleRemoveItem = async (e, id) => {
    e.stopPropagation();
    await removeWishlistItem(id);
    toast.info("Item removed from wishlist ❌");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 font-inter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          My Wishlist
        </h2>
        <Button
          variant="outline"
          onClick={handleClearAll}
          className="flex items-center gap-2 text-red-600 hover:text-red-700 border-red-400 hover:bg-red-50 w-full sm:w-auto text-sm sm:text-base"
        >
          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
          Clear All
        </Button>
      </div>

      {/* Wishlist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
        {wishlist.map((product) => (
          <div
            key={product._id}
            onClick={() => navigate(`/product/${product.slug}`)}
            className="relative border rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer bg-white group"
          >
            {/* Remove Button */}
            <button
              onClick={(e) => handleRemoveItem(e, product._id)}
              className="absolute top-2 right-2 bg-white/90 hover:bg-red-100 text-red-600 rounded-full p-1 shadow-sm transition-all z-10 opacity-0 group-hover:opacity-100"
            >
              <XCircle className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Product Image */}
            <div className="w-full h-44 sm:h-48 flex items-center justify-center bg-gray-50 overflow-hidden">
              <img
                src={product.images?.[0]}
                alt={product.title}
                className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Product Info */}
            <div className="p-4 text-center sm:text-left">
              <h3 className="font-semibold text-[#02066F] text-sm sm:text-base truncate">
                {product.title}
              </h3>
              <p className="text-gray-700 font-medium text-sm sm:text-base mt-1">
                ₹{product.price}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
