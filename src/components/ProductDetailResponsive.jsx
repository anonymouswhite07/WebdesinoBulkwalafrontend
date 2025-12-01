import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useProductStore } from "@/store/product.store";
import { useCartStore } from "@/store/cart.store";
import { toast } from "sonner";
import { ResponsiveContainer, ResponsiveGrid, ResponsiveCard, ResponsiveText, ResponsiveButton } from "@/components/ResponsiveUtils";

const ProductDetailResponsive = () => {
  const { slug } = useParams();
  const { getProductBySlug, selectedProduct: product, loading, error } = useProductStore();
  const { addToCart } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (slug) {
      getProductBySlug(slug);
    }
  }, [slug, getProductBySlug]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({ ...product, quantity });
      toast.success(`${product.title} added to cart!`);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    // Navigate to cart page
    window.location.href = "/cart";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ResponsiveText size="lg" color="text-gray-600">
          Loading product details...
        </ResponsiveText>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <ResponsiveText size="lg" color="text-red-500">
          Error loading product: {error}
        </ResponsiveText>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-64">
        <ResponsiveText size="lg" color="text-gray-600">
          Product not found
        </ResponsiveText>
      </div>
    );
  }

  const discountPercentage = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <ResponsiveContainer className="py-6 sm:py-8">
      <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
        {/* Product Images */}
        <div className="lg:w-1/2">
          <ResponsiveCard className="p-4 sm:p-6">
            {/* Main Image */}
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
              <img
                src={product.images?.[selectedImage] || product.image || "https://ik.imagekit.io/bulkwala/demo/default-product.png"}
                alt={product.title}
                className="w-full h-full object-contain"
              />
              {discountPercentage > 0 && (
                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-md text-sm font-bold">
                  {discountPercentage}% OFF
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            <div className="flex gap-3 sm:gap-4 overflow-x-auto py-2">
              {product.images?.map((image, index) => (
                <div
                  key={index}
                  className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden cursor-pointer border-2 ${
                    selectedImage === index ? "border-[#02066F]" : "border-gray-300"
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={image}
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </ResponsiveCard>
        </div>

        {/* Product Info */}
        <div className="lg:w-1/2">
          <ResponsiveCard className="p-4 sm:p-6">
            <div className="space-y-4">
              <div>
                <ResponsiveText size="2xl" weight="bold" color="text-gray-800" className="mb-2">
                  {product.title}
                </ResponsiveText>
                <ResponsiveText size="lg" color="text-gray-600">
                  {product.category?.name} • {product.subcategory?.name}
                </ResponsiveText>
              </div>

              <div className="flex items-center gap-3">
                {product.discountPrice ? (
                  <>
                    <ResponsiveText size="2xl" weight="bold" color="text-[#02066F]">
                      ₹{product.discountPrice}
                    </ResponsiveText>
                    <ResponsiveText size="lg" color="text-gray-500" className="line-through">
                      ₹{product.price}
                    </ResponsiveText>
                    <div className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                      {discountPercentage}% OFF
                    </div>
                  </>
                ) : (
                  <ResponsiveText size="2xl" weight="bold" color="text-[#02066F]">
                    ₹{product.price}
                  </ResponsiveText>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <ResponsiveText size="lg" weight="semibold" color="text-gray-800" className="mb-3">
                  Product Description
                </ResponsiveText>
                <ResponsiveText size="base" color="text-gray-600">
                  {product.description || "No description available for this product."}
                </ResponsiveText>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <ResponsiveText size="lg" weight="semibold" color="text-gray-800" className="mb-3">
                  Product Details
                </ResponsiveText>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <ResponsiveText size="sm" color="text-gray-500">SKU</ResponsiveText>
                    <ResponsiveText size="base" color="text-gray-800">{product.sku || "N/A"}</ResponsiveText>
                  </div>
                  <div>
                    <ResponsiveText size="sm" color="text-gray-500">Brand</ResponsiveText>
                    <ResponsiveText size="base" color="text-gray-800">{product.brand || "N/A"}</ResponsiveText>
                  </div>
                  <div>
                    <ResponsiveText size="sm" color="text-gray-500">Stock</ResponsiveText>
                    <ResponsiveText size="base" color="text-gray-800">
                      {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                    </ResponsiveText>
                  </div>
                </div>
              </div>

              {product.stock > 0 && (
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <ResponsiveText size="base" weight="semibold" color="text-gray-800">
                        Quantity:
                      </ResponsiveText>
                      <div className="flex items-center border border-gray-300 rounded-md">
                        <button
                          className="px-3 py-2 text-lg font-bold touch-friendly"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        >
                          -
                        </button>
                        <span className="px-4 py-2 text-base">{quantity}</span>
                        <button
                          className="px-3 py-2 text-lg font-bold touch-friendly"
                          onClick={() => setQuantity(quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <ResponsiveButton
                      onClick={handleAddToCart}
                      size="lg"
                      variant="primary"
                      fullWidth
                      className="sm:w-1/2"
                    >
                      Add to Cart
                    </ResponsiveButton>
                    <ResponsiveButton
                      onClick={handleBuyNow}
                      size="lg"
                      variant="outline"
                      fullWidth
                      className="sm:w-1/2"
                    >
                      Buy Now
                    </ResponsiveButton>
                  </div>
                </div>
              )}

              {product.stock <= 0 && (
                <div className="border-t border-gray-200 pt-4">
                  <ResponsiveButton
                    disabled
                    size="lg"
                    variant="secondary"
                    fullWidth
                  >
                    Out of Stock
                  </ResponsiveButton>
                </div>
              )}
            </div>
          </ResponsiveCard>
        </div>
      </div>

      {/* Additional Product Info */}
      <div className="mt-6 sm:mt-8">
        <ResponsiveCard className="p-4 sm:p-6">
          <ResponsiveText size="xl" weight="semibold" color="text-gray-800" className="mb-4">
            Product Information
          </ResponsiveText>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <ResponsiveText size="lg" weight="semibold" color="text-gray-700" className="mb-3">
                Specifications
              </ResponsiveText>
              <ul className="space-y-2">
                {product.specifications?.map((spec, index) => (
                  <li key={index} className="flex">
                    <span className="font-medium text-gray-600 w-32">{spec.key}:</span>
                    <span className="text-gray-800">{spec.value}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <ResponsiveText size="lg" weight="semibold" color="text-gray-700" className="mb-3">
                Features
              </ResponsiveText>
              <ul className="space-y-2">
                {product.features?.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-[#02066F] mr-2">✓</span>
                    <span className="text-gray-800">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </ResponsiveCard>
      </div>
    </ResponsiveContainer>
  );
};

export default ProductDetailResponsive;