import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, Link } from "react-router-dom";
import useCartStore from "@/store/cart.store";
import { useOfferStore } from "@/store/offer.store";
import useAuthStore from "@/store/auth.store";

const Cart = () => {
  const {
    cart,
    totalPrice,
    shippingPrice,
    itemsPrice,
    isLoading,
    isUpdating,
    couponError, // From store for error messages
    fetchCart,
    updateCart,
    removeCartItem,
    clearCart,
    applyCoupon,
    removeCoupon,
    discount,
    couponApplied,
    appliedCouponCode,
    flashDiscount,
    applyReferral,
    removeReferral,
    referralDiscount,
    referralApplied,
    buyNowProductId,
    clearBuyNow,
  } = useCartStore();
  const { fetchActiveOffer, timeLeft } = useOfferStore();
  const { user } = useAuthStore();

  const navigate = useNavigate();
  const [isFetched, setIsFetched] = useState(false);
  const [couponCode, setCouponCode] = useState(""); // State to store coupon code
  const [referralCode, setReferralCode] = useState("");
  const [loadError, setLoadError] = useState(null); // New state for load errors

  // ✅ Fetch cart data on mount
  useEffect(() => {
    const loadCart = async () => {
      // Detect iOS/Safari
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      
      if (isIOS || isSafari) {
        console.log("Cart page: Detected iOS/Safari environment");
      }
      
      try {
        // Reset error state
        setLoadError(null);
        
        if (isIOS || isSafari) {
          console.log("Cart page: Starting cart loading process");
        }
        
        // Add timeout to prevent infinite loading
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Cart loading timeout')), 15000)
        );
        
        const fetchPromise = fetchCart();
        await Promise.race([fetchPromise, timeoutPromise]);
        
        if (isIOS || isSafari) {
          console.log("Cart page: Cart loading completed successfully");
        }
      } catch (error) {
        console.error("Cart loading error:", error);
        if (isIOS || isSafari) {
          console.log("Cart page: Cart loading failed", error.message);
        }
        setLoadError(error.message || "Failed to load cart");
        // Set fetched to true even on error to prevent infinite loading
      } finally {
        setIsFetched(true);
      }
    };
    
    // Only load cart if we're in browser environment
    if (typeof window !== "undefined") {
      loadCart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // fetchCart is stable from zustand store

  // ✅ Loading state with timeout protection
  if (isLoading || !isFetched) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-gray-600 text-base sm:text-lg">
        <p>Loading cart...</p>
        <div className="mt-4 w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // ✅ Error state
  if (loadError) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center gap-4 text-gray-600 text-base sm:text-lg">
        <p className="text-red-500">Error: {loadError}</p>
        <p>There was a problem loading your cart. Please try again.</p>
        <Button 
          onClick={() => {
            setIsFetched(false);
            setLoadError(null);
            fetchCart();
          }} 
          className="bg-[#02066F]"
        >
          Retry
        </Button>
      </div>
    );
  }

  // ✅ Empty cart
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center gap-4 text-gray-600 text-base sm:text-lg">
        <p>Your cart is empty.</p>
        <Button onClick={() => navigate("/products")} className="bg-[#02066F]">
          Browse Products
        </Button>
      </div>
    );
  }

  // ✅ Handlers
  const handleUpdateQuantity = async (productId, quantity) => {
    try {
      await updateCart(productId, quantity);
    } catch (error) {
      console.error("Failed to update quantity:", error);
      toast.error("Failed to update quantity");
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await removeCartItem(productId);
      await fetchCart();
      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Failed to remove item:", error);
      toast.error("Failed to remove item");
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      toast.success("Cart cleared");
    } catch (error) {
      console.error("Failed to clear cart:", error);
      toast.error("Failed to clear cart");
    }
  };

  const handleApplyCoupon = async () => {
    try {
      if (couponApplied) {
        toast.error("Coupon has already been applied.");
        return;
      }

      if (referralApplied) {
        toast.error("You can't use a coupon when a referral is applied.");
        return;
      }

      if (flashDiscount > 0) {
        toast.error(
          "Flash Offer is active — you can't apply a coupon right now."
        );
        return;
      }

      const result = await applyCoupon(couponCode);

      if (!result.success) {
        toast.error(result.message || "Invalid coupon code");
        return;
      }

      toast.success(result.message || "Coupon applied successfully!");
      setCouponCode("");
    } catch (error) {
      console.error("Error applying coupon:", error);
      toast.error("Something went wrong while applying coupon");
    }
  };

  // Remove coupon
  const handleRemoveCoupon = async () => {
    try {
      await removeCoupon();
      await fetchCart();
      toast.success("Coupon removed");
    } catch (error) {
      console.error("Failed to remove coupon:", error);
      toast.error("Failed to remove coupon");
    }
  };

  const handleApplyReferral = async () => {
    try {
      if (couponApplied) {
        toast.error("You can't use referral when a coupon is applied.");
        return;
      }

      if (flashDiscount > 0) {
        toast.error("You can't apply referral during an active flash offer.");
        return;
      }

      const result = await applyReferral(referralCode);
      if (!result.success) {
        toast.error(result.message || "Invalid referral code");
        return;
      }

      toast.success(result.message || "Referral applied successfully!");
      setReferralCode("");
    } catch (error) {
      console.error("Error applying referral:", error);
      toast.error("Something went wrong while applying referral");
    }
  };

  const handleRemoveReferral = async () => {
    try {
      const res = await removeReferral();
      if (res.success) toast.success("Referral removed");
      else toast.error(res.message || "Failed to remove referral");
    } catch (error) {
      console.error("Error removing referral:", error);
      toast.error("Failed to remove referral");
    }
  };

  // NOTE: totalPrice coming from store already contains discount (store/calculation),
  // so we should display totalPrice directly and avoid subtracting discount again here.
  const displayedTotal =
    totalPrice != null ? Number(totalPrice).toFixed(2) : "0.00";

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // ✅ Layout
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-center mb-6">
          Your Cart
        </h1>

        {/* ✅ Guest cart message */}
        {!user && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 text-sm">
              You're browsing as a guest.{" "}
              <Link
                to="/login"
                className="underline font-semibold hover:text-yellow-900"
              >
                Login
              </Link>{" "}
              to save your cart and proceed to checkout.
            </p>
          </div>
        )}

        {/* Cart Items */}
        <div className="space-y-6">
          {cart.items.map((item, index) => {
            // ✅ Handle both guest cart (productId) and backend cart (product._id) structures
            const productId = item.product?._id || item.productId;
            const product = item.product || null;

            // Skip if no product info available
            if (!productId) return null;

            return (
              <div
                key={productId || index}
                id={`cart-item-${productId}`}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b py-4 gap-4 sm:gap-6"
              >
                {/* Show loading state if product details not loaded yet (guest cart) */}
                {!product ? (
                  <div className="w-full flex items-center justify-center py-8">
                    <div className="flex flex-col items-center">
                      <p className="text-gray-500">Loading product details...</p>
                      <div className="mt-2 w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-xs text-gray-400 mt-2">If this takes too long, try refreshing the page</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Left: Product Info */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full">
                      <img
                        src={
                          product.images?.[0] ||
                          "https://ik.imagekit.io/bulkwala/demo/default-product.png"
                        }
                        alt={product.title || "Product"}
                        className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 object-cover rounded-md mx-auto sm:mx-0"
                        onError={(e) => {
                          e.target.src = "https://ik.imagekit.io/bulkwala/demo/default-product.png";
                        }}
                      />
                      <div className="flex flex-col gap-2 w-full">
                        <h3 className="text-lg sm:text-xl font-medium text-gray-800">
                          {product.title || "Product"}
                        </h3>
                        <p className="text-gray-500 text-sm line-clamp-2">
                          {product.description || ""}
                        </p>
                        <p className="text-gray-900 font-semibold text-base sm:text-lg">
                          ₹{product.discountPrice || product.price || 0}
                          {product.discountPrice &&
                            product.discountPrice < product.price && (
                              <span className="text-gray-400 line-through text-sm ml-2">
                                ₹{product.price}
                              </span>
                            )}
                        </p>
                        {/* ✅ Stock warnings */}
                        {product.stock !== undefined && (
                          <div className="mt-1">
                            {product.stock === 0 ? (
                              <p className="text-red-600 text-xs font-medium">
                                ⚠️ Out of Stock
                              </p>
                            ) : product.stock < 5 ? (
                              <p className="text-orange-600 text-xs font-medium">
                                ⚠️ Only {product.stock} left in stock
                              </p>
                            ) : item.quantity > product.stock ? (
                              <p className="text-red-600 text-xs font-medium">
                                ⚠️ Only {product.stock} available. Quantity
                                adjusted.
                              </p>
                            ) : null}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Quantity + Remove */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                      <Input
                        type="number"
                        min={1}
                        max={5}
                        value={item.quantity}
                        onChange={(e) => {
                          const raw = e.target.value;
                          let newQty = parseInt(raw) || 1;

                          // 💥 Detect increment attempt
                          const isIncrement = newQty > item.quantity;

                          // 💥 Check max quantity
                          if (newQty > 5) {
                            if (isIncrement) {
                              toast.warning(
                                "Maximum allowed quantity is 5 per product"
                              );
                            }

                            // Force UI to remain 5
                            newQty = 5;
                            e.target.value = 5;

                            if (item.quantity !== 5) {
                              handleUpdateQuantity(productId, 5);
                            }
                            return;
                          }

                          // 🚨 Stock check
                          const maxStock = product?.stock || 999;
                          if (newQty > maxStock) {
                            toast.warning(
                              `Only ${maxStock} items available in stock`
                            );
                            newQty = maxStock;
                            e.target.value = maxStock;

                            if (item.quantity !== maxStock) {
                              handleUpdateQuantity(productId, maxStock);
                            }
                            return;
                          }

                          handleUpdateQuantity(productId, newQty);
                        }}
                        className="w-16 text-center border border-gray-300 rounded-md shadow-sm text-sm"
                        disabled={isUpdating || product?.stock === 0}
                        title={
                          product?.stock === 0
                            ? "Out of stock"
                            : `Max: ${product?.stock || "N/A"}`
                        }
                      />
                      <Button
                        variant="destructive"
                        onClick={() => handleRemoveItem(productId)}
                        disabled={isUpdating}
                        className="text-sm sm:text-base px-3 sm:px-4"
                      >
                        Remove
                      </Button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
        {/* Flash Offer Banner */}
        {cart.flashDiscount > 0 && timeLeft > 0 && (
          <div className="p-4 mb-4 bg-gradient-to-r from-[#02066F] to-[#0A1280] text-white rounded-md text-center animate-pulse transition-all duration-500 ease-in-out">
            <p className="font-semibold">
              ⚡ Flash Offer {cart.flashDiscountPercent}% OFF applied
              automatically!
            </p>
            <p className="text-sm text-yellow-300 mt-1">
              Ends in {formatTime(timeLeft)}
            </p>
          </div>
        )}
        {/* Summary Section */}
        <div className="mt-8 border-t pt-6 space-y-3 text-sm sm:text-base md:text-lg">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Items Price</span>
            <span className="font-medium">₹{(itemsPrice || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Shipping</span>
            <span className="font-medium">
              ₹{(shippingPrice || 0).toFixed(2)}
            </span>
          </div>

          {/* Show only one discount — priority: Coupon > Referral > Flash */}
          {discount > 0 ? (
            <div className="flex justify-between text-green-600 font-medium">
              <span>Coupon Discount</span>
              <span>-₹{Number(discount).toFixed(2)}</span>
            </div>
          ) : cart.referralDiscount > 0 ? (
            <div className="flex justify-between text-purple-600 font-medium">
              <span>Referral Discount</span>
              <span>-₹{cart.referralDiscount.toFixed(2)}</span>
            </div>
          ) : cart.flashDiscount > 0 ? (
            <div className="flex justify-between text-blue-600 font-medium">
              <span>Flash Offer ({cart.flashDiscountPercent}% OFF)</span>
              <span>-₹{cart.flashDiscount.toFixed(2)}</span>
            </div>
          ) : null}

          <div className="flex justify-between border-t pt-4 text-base sm:text-lg md:text-xl font-semibold">
            <span>Total Price</span>
            <span>₹{displayedTotal}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Price inclusive of all applicable taxes.
          </p>
        </div>
        {/* Coupon Input / Applied Coupon */}
        <div className="mt-8">
          {!couponApplied ? (
            <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 mt-8">
              <Input
                type="text"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="w-full sm:w-auto text-sm sm:text-base"
              />
              <Button
                onClick={handleApplyCoupon}
                disabled={isUpdating || !couponCode}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base"
              >
                Apply Coupon
              </Button>
            </div>
          ) : (
            <div className="mt-4 flex items-center justify-between bg-green-50 border border-green-200 p-3 rounded-md">
              <div>
                <p className="text-green-800 font-medium">
                  ✅ Coupon applied
                  {appliedCouponCode ? ` — ${appliedCouponCode}` : ""}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {discount > 0
                    ? `You saved ₹${Number(discount).toFixed(2)}`
                    : null}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleRemoveCoupon}
                  disabled={isUpdating}
                  className="text-sm sm:text-base"
                >
                  Remove Coupon
                </Button>
              </div>
            </div>
          )}

          {couponError && (
            <p className="text-red-500 text-sm mt-2">{couponError}</p>
          )}
        </div>
        {/* Referral Code Section */}
        <div className="mt-8">
          {!referralApplied ? (
            <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4">
              <Input
                type="text"
                placeholder="Enter referral code"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                className="w-full sm:w-auto text-sm sm:text-base"
              />
              <Button
                onClick={handleApplyReferral}
                disabled={!referralCode}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base"
              >
                Apply Referral
              </Button>
            </div>
          ) : (
            <div className="mt-4 flex items-center justify-between bg-green-50 border border-green-200 p-3 rounded-md">
              <div>
                <p className="text-green-800 font-medium">
                  ✅ Referral applied — {referralCode}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  You saved ₹{referralDiscount.toFixed(2)}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleRemoveReferral}
                className="text-sm sm:text-base"
              >
                Remove Referral
              </Button>
            </div>
          )}
        </div>
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 mt-8">
          <Button
            variant="outline"
            onClick={handleClearCart}
            disabled={isUpdating}
            className="w-full sm:w-auto text-sm sm:text-base"
          >
            Clear Cart
          </Button>
          <Button
            onClick={() => navigate("/payment")}
            disabled={isUpdating}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base"
          >
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Cart;