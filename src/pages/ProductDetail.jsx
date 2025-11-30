import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reviewSchema } from "@/schemas/reviewSchema";
import { useProductStore } from "@/store/product.store";
import { useReviewStore } from "@/store/review.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Star,
  Heart,
  Minus,
  Plus,
  Trash2,
  Edit3,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import useCartStore from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";
import useAuthStore from "@/store/auth.store";

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const formRef = useRef(null);

  const { user } = useAuthStore();
  const { wishlist, toggleWishlist, fetchWishlist } = useWishlistStore();
  const { singleProduct, getProductBySlug, products, fetchProducts, loading } =
    useProductStore();
  const { addToCart, setBuyNowProduct } = useCartStore();
  const { reviews, fetchReviews, addReview, deleteReview, updateReview } =
    useReviewStore();

  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editReviewId, setEditReviewId] = useState(null);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: { text: "", rating: 0 },
  });

  // ✅ Fetch product by slug when slug changes
  useEffect(() => {
    if (slug) {
      getProductBySlug(slug);
    }
  }, [slug]);

  useEffect(() => {
    if (singleProduct?._id) {
      fetchReviews(singleProduct._id);
    }
  }, [singleProduct?._id]);

  useEffect(() => {
    if (user && user._id) {
      fetchWishlist();
    }
  }, [user?._id]);

  useEffect(() => {
    if (!products || products.length < 8) {
      fetchProducts({ limit: 8 });
    }
  }, []);

  useEffect(() => {
    if (singleProduct && wishlist?.length >= 0) {
      const exists = wishlist.some((p) => p._id === singleProduct._id);
      setIsInWishlist(exists);
    }
  }, [wishlist, singleProduct]);

  useEffect(() => {
    if (singleProduct?.images?.length > 0) {
      setSelectedMedia({ type: "image", url: singleProduct.images[0] });
    } else if (singleProduct?.videos?.length > 0) {
      setSelectedMedia({ type: "video", url: singleProduct.videos[0] });
    }
  }, [singleProduct]);

  if (loading || !singleProduct) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600">
        Loading Product details ...
      </div>
    );
  }

  const product = singleProduct;

  const handleAddToWishlist = async () => {
    try {
      setIsWishlistLoading(true);
      const updatedList = await toggleWishlist(product._id);
      if (!updatedList) return;

      const nowInWishlist = updatedList.some((p) => p._id === product._id);
      setIsInWishlist(nowInWishlist);
      toast[nowInWishlist ? "success" : "info"](
        `${product.title} ${
          nowInWishlist ? "added to wishlist ❤" : "removed from wishlist ❌"
        }`
      );
    } catch {
      toast.error("Something went wrong while updating wishlist");
    } finally {
      setIsWishlistLoading(false);
    }
  };

  const onSubmitReview = async (data) => {
    if (!selectedRating) {
      toast.error("Please select a rating before submitting!");
      return;
    }

    const formData = new FormData();
    formData.append("text", data.text);
    formData.append("rating", selectedRating);
    if (data.images && data.images.length > 0) {
      for (const file of data.images) formData.append("images", file);
    }

    try {
      let result;
      if (isEditing && editReviewId) {
        result = await updateReview(product._id, editReviewId, formData);
      } else {
        result = await addReview(product._id, formData);
      }

      if (result) {
        toast.success(
          isEditing
            ? "Review updated successfully ✅"
            : "Review submitted successfully ✅"
        );
        reset();
        setSelectedRating(0);
        setIsEditing(false);
        setEditReviewId(null);
        await fetchReviews(product._id);
        await getProductBySlug(slug);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong!"
      );
    }
  };

  const handleEditReview = (review) => {
    setValue("text", review.text);
    setSelectedRating(review.rating);
    setIsEditing(true);
    setEditReviewId(review._id);
    toast.info("You can now edit your review ✏");
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleCancelEdit = () => {
    reset();
    setSelectedRating(0);
    setIsEditing(false);
    setEditReviewId(null);
    toast.info("Edit cancelled 🚫");
  };

  const handleDeleteReview = async (reviewId) => {
    await deleteReview(product._id, reviewId);
    toast.success("Review deleted successfully 🗑");
    await fetchReviews(product._id);
    await getProductBySlug(slug);
  };

  const handleAddToCart = async () => {
    await addToCart(product._id, quantity);
    setIsAddedToCart(true);
    toast.success(`${product.title} added to your cart 🛒`);
    setTimeout(() => setIsAddedToCart(false), 2500);
  };

  const handleViewCart = () => navigate("/cart");
  const increaseQty = () => setQuantity((prev) => prev + 1);
  const decreaseQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="flex flex-col items-center">
          {/* BIG IMAGE SECTION */}
          <div className="w-full h-[300px] sm:h-[400px] bg-white rounded-xl shadow-md flex justify-center items-center overflow-hidden">
            {selectedMedia?.type === "image" && (
              <img
                src={selectedMedia.url}
                alt={product.title}
                className="max-h-full max-w-full object-contain"
              />
            )}

            {selectedMedia?.type === "video" && (
              <div className="w-full h-full flex flex-col">
                <video
                  key={selectedMedia.url}
                  src={selectedMedia.url}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain rounded-xl bg-black"
                  onError={(e) => {
                    console.error("Video playback error:", e);
                    console.error("Video URL:", selectedMedia.url);
                    
                    // Get more detailed error information
                    console.error("Video networkState:", e.target.networkState);
                    console.error("Video readyState:", e.target.readyState);
                    console.error("Error details:", {
                      code: e.nativeEvent?.code,
                      message: e.nativeEvent?.message,
                      target: e.target
                    });
                    
                    // Network state meanings:
                    // 0 = NETWORK_EMPTY
                    // 1 = NETWORK_IDLE
                    // 2 = NETWORK_LOADING
                    // 3 = NETWORK_NO_SOURCE
                    const networkStates = {
                      0: "NETWORK_EMPTY",
                      1: "NETWORK_IDLE",
                      2: "NETWORK_LOADING",
                      3: "NETWORK_NO_SOURCE"
                    };
                    
                    console.error("Network state:", networkStates[e.target.networkState]);
                    
                    // Try to determine the specific issue
                    const videoUrl = selectedMedia.url;
                    const fileExtension = videoUrl.split('.').pop()?.toLowerCase();
                    
                    console.error("Video file extension:", fileExtension);
                    console.error("Browser supports MP4:", document.createElement('video').canPlayType('video/mp4'));
                    console.error("Browser supports WebM:", document.createElement('video').canPlayType('video/webm'));
                  }}
                  // Add preload metadata to help with playback
                  preload="metadata"
                />
                <div className="text-xs text-gray-500 mt-1 text-center">
                  If video doesn't play, try these solutions:
                  <ul className="list-disc pl-4 mt-1 text-left">
                    <li><strong>Open the video URL directly in your browser</strong> - if it works there, the issue is with how the React app requests it</li>
                    <li>Right-click and save video to play locally</li>
                    <li>Try a different browser (Chrome, Firefox, Edge)</li>
                    <li>Check if the video format is supported (MP4 with H.264 codec)</li>
                    <li>Verify the video file is not corrupted</li>
                    <li>Try refreshing the page</li>
                  </ul>
                  <div className="mt-2 p-2 bg-yellow-100 text-yellow-800 rounded">
                    Video URL: {selectedMedia.url}
                  </div>
                  <div className="mt-2 p-2 bg-red-100 text-red-800 rounded">
                    <strong>Video Playback Issue Detected:</strong> The video file appears to be inaccessible from the React app. 
                    This is commonly caused by:
                    <ul className="list-disc pl-5 mt-1">
                      <li><strong>ImageKit video transformation limits exceeded</strong> (upgrade plan needed)</li>
                      <li>Missing browser headers in React video requests</li>
                      <li>CORS or referer policy restrictions</li>
                      <li>File permissions or accessibility issues</li>
                    </ul>
                    <div className="mt-2 font-semibold">
                      Solution: If the video plays when opened directly in your browser, consider upgrading your ImageKit plan or 
                      configuring proper CORS headers. The file is uploaded correctly but ImageKit may be blocking React app access.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Thumbnail section */}
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {/* All Images */}
            {product.images?.map((img, i) => (
              <img
                key={i}
                src={img}
                onClick={() => setSelectedMedia({ type: "image", url: img })}
                className={`w-16 h-16 sm:w-20 sm:h-20 border rounded-md object-cover cursor-pointer 
      ${selectedMedia?.url === img ? "ring-2 ring-[#02066F]" : ""}`}
              />
            ))}

            {/* Video Thumbnail */}
            {product.videos?.length > 0 &&
              product.videos.map((vid, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedMedia({ type: "video", url: vid })}
                  className={`
        w-16 h-16 sm:w-20 sm:h-20 border rounded-md relative cursor-pointer 
        bg-black flex items-center justify-center overflow-hidden
        ${selectedMedia?.url === vid ? "ring-2 ring-[#02066F]" : ""}
      `}
                >
                  {/* Play Icon */}
                  <div className="text-white text-2xl opacity-80">▶</div>

                  {/* Optional blurred video preview background */}
                  <video
                    src={vid}
                    className="absolute inset-0 w-full h-full object-cover opacity-40"
                    muted
                    preload="metadata"
                    onError={(e) => {
                      console.error("Thumbnail video error:", e);
                      console.error("Thumbnail URL:", vid);
                      console.error("Thumbnail networkState:", e.target.networkState);
                    }}
                  ></video>
                </div>
              ))}
          </div>
        </div>

        {/* DETAILS */}
        <div className="flex flex-col justify-between space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {product.title}
            </h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base leading-relaxed">
              {product.description}
            </p>
            <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
              <div className="flex items-center gap-2 mt-2">
                {product.discountPrice &&
                product.discountPrice < product.price ? (
                  <>
                    <span className="text-3xl font-semibold text-green-700">
                      ₹{product.discountPrice}
                    </span>
                    <span className="text-gray-400 line-through text-lg">
                      ₹{product.price}
                    </span>
                    <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded-md ml-2">
                      {Math.round(
                        ((product.price - product.discountPrice) /
                          product.price) *
                          100
                      )}
                      % OFF
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-semibold text-[#02066F]">
                    ₹{product.price}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={`${
                      i < Math.round(product.averageRating || 0)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-1 text-sm text-gray-600">
                  ({product.totalReviews || 0})
                </span>
              </div>
            </div>
            <Separator className="mt-6" />
            {/* Quantity + Add to Cart */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
              <div className="flex items-center gap-3">
                <Button size="icon" variant="outline" onClick={decreaseQty}>
                  <Minus size={18} />
                </Button>
                <span className="text-lg font-semibold">{quantity}</span>
                <Button size="icon" variant="outline" onClick={increaseQty}>
                  <Plus size={18} />
                </Button>
              </div>

              <div className="flex gap-3 w-full sm:w-auto">
                <Button
                  onClick={async () => {
                    await addToCart(product._id, quantity);
                    setBuyNowProduct(product._id);
                    navigate("/cart");
                  }}
                  className="flex-1 bg-orange-600 text-white hover:bg-orange-700"
                >
                  Buy Now
                </Button>

                <Button
                  onClick={handleAddToCart}
                  className={`flex-1 bg-blue-600 text-white hover:bg-blue-700 ${
                    isAddedToCart ? "opacity-80" : ""
                  }`}
                >
                  {isAddedToCart ? (
                    <span className="flex items-center gap-2">
                      <CheckCircle size={18} /> Added
                    </span>
                  ) : (
                    "Add to Cart"
                  )}
                </Button>

                <Button
                  onClick={handleViewCart}
                  className="flex-1 bg-gray-500 text-white hover:bg-gray-600"
                >
                  View Cart
                </Button>
              </div>
            </div>
            <Separator className="mt-6" />

            {/* Wishlist + WhatsApp */}
            <div className="flex flex-wrap items-center gap-4 mt-8">
              <Button
                onClick={handleAddToWishlist}
                disabled={isWishlistLoading}
                variant="outline"
                className={`flex items-center gap-2 ${
                  isInWishlist
                    ? "border-red-500 text-red-600 bg-red-50 hover:bg-red-100"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Heart
                  className={`w-5 h-5 ${
                    isInWishlist
                      ? "fill-red-500 text-red-500"
                      : "text-[#02066F]"
                  }`}
                />
                {isInWishlist ? "Wishlisted" : "Add to Wishlist"}
              </Button>

              {/* UPDATED WHATSAPP BUTTON */}
              <Button
                onClick={() =>
                  window.open(
                    `https://wa.me/9310701078?text=${encodeURIComponent(
                      `Hi, I'm interested in this product: ${product.title}`
                    )}`,
                    "_blank"
                  )
                }
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
              >
                {/* Real WhatsApp SVG */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="white"
                >
                  <path d="M20.52 3.48A11.8 11.8 0 0 0 12.04 0C5.5 0 .32 5.18.32 11.72c0 2.07.54 4.08 1.57 5.86L0 24l6.57-1.85a11.68 11.68 0 0 0 5.47 1.38h.01c6.54 0 11.82-5.18 11.82-11.72 0-3.13-1.22-6.08-3.35-8.33zM12.05 21.3c-1.72 0-3.4-.46-4.87-1.33l-.35-.21-3.9 1.1 1.04-3.8-.23-.39a9.51 9.51 0 0 1-1.47-5.15c0-5.28 4.32-9.58 9.62-9.58 2.57 0 4.99 1 6.82 2.8a9.42 9.42 0 0 1 2.81 6.77c-.01 5.27-4.33 9.59-9.47 9.59zm5.28-7.14c-.29-.15-1.72-.85-1.98-.94-.27-.1-.46-.15-.65.15-.19.29-.75.94-.92 1.13-.17.2-.34.22-.63.07-.29-.15-1.22-.45-2.32-1.45-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.6.14-.15.29-.34.44-.51.15-.17.2-.29.3-.48.1-.19.05-.36-.02-.51-.08-.15-.65-1.57-.9-2.15-.24-.58-.49-.5-.65-.51h-.56c-.19 0-.5.07-.76.36-.26.29-1 1-1 2.44 0 1.43 1.03 2.81 1.17 3 .14.19 2.02 3.18 4.88 4.46.68.29 1.22.46 1.64.59.69.22 1.32.19 1.82.12.55-.08 1.72-.7 1.97-1.38.24-.67.24-1.25.17-1.38-.07-.12-.26-.2-.55-.35z" />
                </svg>
                Share on WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* REVIEWS */}
      <div className="max-w-7xl mx-auto mt-16 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold text-[#02066F] mb-6">
          Customer Reviews
        </h2>

        <form
          ref={formRef}
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(onSubmitReview)(e);
          }}
          className="mb-8 space-y-4 bg-white p-4 sm:p-6 rounded-lg shadow"
        >
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={28}
                className={`cursor-pointer ${
                  star <= selectedRating
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
                onClick={() => {
                  setSelectedRating(star);
                  setValue("rating", star, { shouldValidate: true });
                }}
              />
            ))}
          </div>
          {errors.rating && (
            <p className="text-red-500 text-sm">{errors.rating.message}</p>
          )}

          <textarea
            {...register("text")}
            placeholder="Write your review..."
            className="w-full border rounded-md p-2 text-sm focus:ring-1 focus:ring-[#02066F]"
          />
          {errors.text && (
            <p className="text-red-500 text-sm">{errors.text.message}</p>
          )}

          <Input
            type="file"
            accept="image/*"
            multiple
            {...register("images")}
            className="border border-gray-300 rounded-md p-2"
          />

          <div className="flex flex-wrap gap-3">
            <Button
              type="submit"
              className="bg-[#02066F] text-white hover:bg-[#01054f]"
            >
              {isEditing ? "Update Review" : "Submit Review"}
            </Button>

            {isEditing && (
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelEdit}
              >
                Cancel Edit
              </Button>
            )}
          </div>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews?.length > 0 ? (
            reviews.map((rev) => (
              <Card
                key={rev._id}
                className={`transition-all ${
                  editReviewId === rev._id
                    ? "border-2 border-blue-500 bg-blue-50/40"
                    : "border border-gray-200"
                }`}
              >
                <CardContent className="p-4 text-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-semibold">
                      {rev.user?.name || "Anonymous"}
                    </p>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditReview(rev)}
                        className="text-gray-400 hover:text-blue-600"
                      >
                        <Edit3 size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteReview(rev._id)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={
                          i < rev.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>

                  <p className="text-sm mb-2 break-words">"{rev.text}"</p>

                  {rev.images?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {rev.images.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt={`review-${i}`}
                          className="w-14 h-14 object-cover rounded-md"
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No reviews yet.</p>
          )}
        </div>
      </div>

      {/* TOP SUGGESTIONS */}
      <div className="max-w-7xl mx-auto mt-20 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold text-[#02066F] mb-6">
          Top Suggestions
        </h2>

        {loading ? (
          <p className="text-gray-500">Loading suggestions...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products
              ?.filter((p) => p._id !== product._id)
              ?.slice(0, 4)
              .map((item) => (
                <div
                  key={item._id}
                  onClick={() => navigate(`/product/${item.slug}`)}
                  className="cursor-pointer bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden"
                >
                  <div className="w-full h-56 flex justify-center items-center bg-gray-50">
                    <img
                      src={item.images?.[0]}
                      alt={item.title}
                      className="h-full object-contain"
                    />
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="font-semibold text-gray-800 truncate">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex flex-col">
                        {item.discountPrice &&
                        item.discountPrice < item.price ? (
                          <>
                            <span className="text-[#02066F] font-semibold">
                              ₹{item.discountPrice}
                            </span>
                            <span className="text-gray-400 line-through text-xs">
                              ₹{item.price}
                            </span>
                          </>
                        ) : (
                          <span className="text-[#02066F] font-semibold">
                            ₹{item.price}
                          </span>
                        )}
                      </div>

                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(item._id, 1);
                          toast.success(`${item.title} added to cart 🛒`);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductDetail;
