import React, { useEffect, useState } from "react";
import useOrderStore from "@/store/order.store";
import useCartStore from "@/store/cart.store";
import { toast } from "sonner";
import ShippingAddressForm from "@/components/ShippingAddressForm";
import useAuthStore from "@/store/auth.store";
import { useNavigate } from "react-router-dom";

const PaymentPage = () => {
  const navigate = useNavigate();

  const {
    paymentMode,
    setPaymentMode,
    handlePayment,
    isLoading: orderLoading,
    paymentStatus,
    resetPaymentStatus,
  } = useOrderStore();

  const {
    cart,
    itemsPrice,
    shippingPrice,
    totalPrice,
    totalItems,
    fetchCart,
    clearCart,
    cartInitialized,
    isLoading: cartLoading,
  } = useCartStore();

  const { user, updateAddress, removeAddress } = useAuthStore();

  const [formMode, setFormMode] = useState({
    type: "add", // "add" or "edit"
    index: null,
    data: null,
  });

  const resetForm = () => {
    setFormMode({ type: "add", index: null, data: null });
  };

  const [shippingAddress, setShippingAddress] = useState(
    user?.addresses?.[0] || null
  );

  // ✅ Fetch cart and Razorpay script once
  useEffect(() => {
    fetchCart();
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // fetchCart is stable from zustand store

  useEffect(() => {
    // 🚨 Redirect only after real cart loaded & not during temporary empty state
    if (
      cartInitialized &&
      !cartLoading &&
      Array.isArray(cart?.items) &&
      cart.items.length === 0 &&
      user // only redirect logged in users
    ) {
      toast.error("Your cart is empty. Please add items before checkout.");
      navigate("/cart");
    }
  }, [cartInitialized, cartLoading, cart]);

  // ✅ Razorpay success listener
  useEffect(() => {
    const handleRazorpaySuccess = async (e) => {
      const verifiedOrder = e.detail.order;
      if (verifiedOrder) {
        if (verifiedOrder.shipmentStatus?.startsWith("Error")) {
          toast.warning(
            "Payment successful! We're processing your order. Tracking details will be shared shortly."
          );
        } else {
          toast.success("Payment Successful!");
        }
        await clearCart();
        navigate("/order-success", {
          state: { orderData: verifiedOrder, paymentType: "Online Payment" },
        });
      } else {
        toast.error("No order data received after payment!");
      }
    };

    // ✅ Razorpay failure listener
    const handleRazorpayFailed = (e) => {
      const error = e.detail?.error;
      let errorMessage = "Payment failed. Please try again.";

      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
      // Payment status is set in order store's error handler (already handled in order.store.js)
    };

    window.addEventListener("razorpay-success", handleRazorpaySuccess);
    window.addEventListener("razorpay-failed", handleRazorpayFailed);

    return () => {
      window.removeEventListener("razorpay-success", handleRazorpaySuccess);
      window.removeEventListener("razorpay-failed", handleRazorpayFailed);
    };
  }, [navigate, clearCart]);

  // 🚨 Wait until cart items are fully loaded (prevents false redirect)
  if (!cartInitialized || cartLoading || !cart?.items) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Loading cart...
      </div>
    );
  }

  // ✅ Detect prepaid mode (any online option except COD & pickup)
  const isPrepaid = ["card", "upi", "netbanking", "online"].includes(
    paymentMode
  );

  // ✅ Base total from backend (already includes coupon/referral/flash discounts)
  let finalDisplayTotal = totalPrice || 0;

  // ✅ If pickup, remove shipping
  if (paymentMode === "pickup") {
    finalDisplayTotal -= shippingPrice || 0;
  }

  // ✅ Apply prepaid discount (₹30 off for online methods)
  const prepaidDiscount = isPrepaid ? 30 : 0;
  if (isPrepaid) finalDisplayTotal -= prepaidDiscount;

  // ✅ Ensure total never goes below zero
  finalDisplayTotal = Math.max(finalDisplayTotal, 0);

  const handleUpdateAddress = async (formData) => {
    const result = await updateAddress({
      address: formData,
      index: formMode.type === "edit" ? formMode.index : undefined,
    });

    if (result.success) {
      toast.success(
        formMode.type === "edit"
          ? "Address updated successfully"
          : "New address added"
      );

      resetForm();
    } else {
      toast.error(result.error);
    }
  };

  const handleSelectAddress = (address) => setShippingAddress(address);

  const proceedToPay = async () => {
    if (!paymentMode) return toast.error("Please select a payment method");
    if (paymentMode !== "pickup" && !shippingAddress)
      return toast.error("Please fill in your address");
    if (!user) return toast.error("User not authenticated");

    // ✅ Reset payment status before attempting payment (if previously failed/cancelled)
    if (paymentStatus === "CANCELLED" || paymentStatus === "FAILED") {
      resetPaymentStatus();
    }

    const result = await handlePayment(cart, shippingAddress);

    if (result?.type === "COD" || result?.type === "PICKUP") {
      const paymentLabel =
        result.type === "PICKUP" ? "Pickup from Store" : "Cash on Delivery";
      toast.success(result.message);
      await clearCart();
      navigate("/order-success", {
        state: { orderData: result.order, paymentType: paymentLabel },
      });
    }
  };

  if (cartLoading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Loading cart details...
      </div>
    );

  if (orderLoading)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-black mx-auto mb-3"></div>
          <p className="text-gray-700 font-medium">Processing payment...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl p-4 sm:p-6 md:p-8 flex flex-col lg:flex-row gap-8">
        {/* 🏠 Shipping Address Section */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-center lg:text-left">
            Shipping Address
          </h2>
          {paymentMode !== "pickup" ? (
            <ShippingAddressForm
              onSubmit={handleUpdateAddress}
              initialData={formMode.data || shippingAddress} // ← FIX
              mode={formMode.type}
            />
          ) : (
            <div className="bg-yellow-50 border border-yellow-300 rounded-md p-4 text-sm text-gray-700 mb-4">
              <p>
                <strong>Pickup selected:</strong> You can collect your order
                directly from our store.
              </p>
              <p className="mt-1 text-[#02066F] font-medium">
                U-33,Khanna Market, West Patel Nagar New Delhi,Near Opposite
                Cottage 9A Delhi 110008
              </p>
              <p className="font-semibold">OR</p>
              <p className="mt-1 text-[#02066F] font-medium">
                Upper Ground Floor, Back Side Building No. M-77, Block-M, Shyam
                Park Uttam Nagar, New Delhi - 110059
              </p>
            </div>
          )}

          {/* Saved Addresses */}
          {paymentMode !== "pickup" && (
            <>
              <h3 className="text-lg sm:text-xl font-semibold mt-8 mb-4">
                Saved Addresses
              </h3>

              <div className="space-y-4">
                {user?.addresses?.length > 0 ? (
                  user.addresses.map((addr, index) => (
                    <div
                      key={index}
                      className={`relative border p-4 rounded-lg cursor-pointer transition ${
                        shippingAddress === addr
                          ? "border-black bg-gray-50"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                      onClick={() => handleSelectAddress(addr)}
                    >
                      {/* ADDRESS DETAILS */}
                      <p className="text-lg font-semibold capitalize">
                        {addr.name}
                      </p>

                      <p className="text-gray-600 text-sm">
                        {addr.street}, {addr.city}, {addr.state}
                      </p>

                      <p className="text-gray-600 text-sm">
                        {addr.postalCode}, {addr.country}
                      </p>

                      <p className="text-gray-700 text-sm">{addr.phone}</p>

                      {/* BUTTONS */}
                      <div className="absolute top-3 right-3 flex gap-3">
                        {/* EDIT BUTTON */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setFormMode({
                              type: "edit",
                              index,
                              data: { ...addr }, // clone to avoid circular JSON error
                            });
                          }}
                          className="text-blue-600 text-xs underline"
                        >
                          Edit
                        </button>

                        {/* DELETE BUTTON */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();

                            toast.custom((t) => (
                              <div className="bg-white shadow-xl rounded-lg p-4 border border-gray-200">
                                <p className="font-medium text-gray-800 mb-2">
                                  Delete this address?
                                </p>

                                <div className="flex gap-3">
                                  <button
                                    onClick={async () => {
                                      toast.dismiss(t.id);

                                      const result = await removeAddress(index);

                                      if (result.success) {
                                        toast.success("Address deleted");

                                        if (shippingAddress === addr) {
                                          setShippingAddress(null);
                                        }
                                      } else {
                                        toast.error(result.error);
                                      }
                                    }}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
                                  >
                                    Delete
                                  </button>

                                  <button
                                    onClick={() => toast.dismiss(t.id)}
                                    className="px-4 py-2 bg-gray-200 rounded-md text-sm hover:bg-gray-300"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ));
                          }}
                          className="text-red-500 text-xs underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">
                    No saved addresses found.
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        {/* 💳 Order Summary + Payment */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-center lg:text-left">
            Order Summary
          </h2>

          {/* Order Table */}
          <div className="border rounded-lg mb-6 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[450px]">
              <thead className="bg-gray-100">
                <tr className="text-gray-600 text-xs sm:text-sm uppercase">
                  <th className="p-3">Product</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Price</th>
                </tr>
              </thead>
              <tbody>
                {cart?.items?.map((item, index) => {
                  // ✅ Handle both guest cart and backend cart structures
                  const product = item.product || null;
                  const productId = product?._id || item.productId || index;

                  if (!product) return null; // Skip if product not loaded

                  const price = product.discountPrice || product.price || 0;

                  return (
                    <tr
                      key={productId}
                      className="border-b last:border-none hover:bg-gray-50 text-sm sm:text-base"
                    >
                      <td className="p-3 text-gray-800">
                        {product.title || "Product"}
                      </td>
                      <td className="p-3 text-center">{item.quantity}</td>
                      <td className="p-3 text-right">
                        ₹{(price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="space-y-3 text-sm sm:text-base">
            <div className="flex justify-between">
              <span>Items Price</span>
              <span>₹{itemsPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>
                {paymentMode === "pickup" ? (
                  <span className="text-green-600 font-medium">
                    Free (Pickup)
                  </span>
                ) : (
                  `₹${shippingPrice.toFixed(2)}`
                )}
              </span>
            </div>

            {/* ✅ Show only one discount type — priority: Coupon > Referral > Flash */}
            {cart?.discount > 0 ? (
              <div className="flex justify-between text-green-600 font-medium">
                <span>Coupon Discount</span>
                <span>-₹{cart.discount.toFixed(2)}</span>
              </div>
            ) : cart?.referralDiscount > 0 ? (
              <div className="flex justify-between text-purple-600 font-medium">
                <span>Referral Discount</span>
                <span>-₹{cart.referralDiscount.toFixed(2)}</span>
              </div>
            ) : cart?.flashDiscount > 0 ? (
              <div className="flex justify-between text-blue-600 font-medium">
                <span>Flash Offer ({cart.flashDiscountPercent}% OFF)</span>
                <span>-₹{cart.flashDiscount.toFixed(2)}</span>
              </div>
            ) : null}

            {/* ✅ Prepaid discount line */}
            {isPrepaid && (
              <div className="flex justify-between text-green-600 font-medium">
                <span>Prepaid Discount</span>
                <span>-₹{prepaidDiscount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between border-t pt-2 font-semibold text-base sm:text-lg">
              <span>Total</span>
              <span>₹{finalDisplayTotal.toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Price inclusive of all applicable taxes (GST included in MRP)
            </p>
          </div>

          {/* Payment Options */}
          <h3 className="text-lg sm:text-xl font-semibold text-center lg:text-left mt-8 mb-3">
            Select Payment Method
          </h3>
          <p className="text-green-700 text-sm mb-3">
            💸 Get flat ₹30 OFF on prepaid orders (UPI, Card, NetBanking)
          </p>

          <div className="space-y-3 mb-6">
            {[
              { label: "💳 Pay Online (Card)", value: "card" },
              { label: "💳 Pay Online (UPI)", value: "upi" },
              { label: "🏦 Net Banking", value: "netbanking" },
              { label: "💵 Cash on Delivery (COD)", value: "cod" },
              { label: "🏬 Pickup from Store", value: "pickup" },
            ].map((option) => (
              <label
                key={option.value}
                className="flex items-center space-x-3 border p-3 sm:p-4 rounded-xl hover:border-black transition cursor-pointer text-sm sm:text-base"
              >
                <input
                  type="radio"
                  name="payment"
                  value={option.value}
                  checked={paymentMode === option.value}
                  onChange={(e) => {
                    setPaymentMode(e.target.value);
                    // ✅ Reset payment status when changing payment method (if previously failed/cancelled)
                    if (
                      paymentStatus === "CANCELLED" ||
                      paymentStatus === "FAILED"
                    ) {
                      resetPaymentStatus();
                    }
                  }}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>

          {/* Pay Button */}
          <div className="border-t pt-5 text-center">
            <p className="text-gray-600 text-sm mb-2">{totalItems} item(s)</p>
            <h3 className="text-2xl sm:text-3xl font-bold mb-6">
              ₹{finalDisplayTotal.toFixed(2)}
            </h3>

            {isPrepaid && (
              <p className="text-gray-500 text-xs text-right">
                ₹30 prepaid discount applied
              </p>
            )}

            <button
              disabled={!paymentMode || orderLoading || finalDisplayTotal <= 0}
              onClick={proceedToPay}
              className="w-full bg-black text-white py-3 sm:py-4 rounded-lg text-sm sm:text-lg font-medium hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {paymentStatus === "CANCELLED"
                ? "Payment Cancelled - Select Payment Method Again"
                : paymentStatus === "FAILED"
                ? "Payment Failed - Try Again"
                : paymentMode === "cod"
                ? "Place Order (COD)"
                : paymentMode === "pickup"
                ? "Place Order (Pickup)"
                : orderLoading
                ? "Processing..."
                : `Proceed to Pay ₹${finalDisplayTotal.toFixed(2)}`}
            </button>

            {/* ✅ Show cancellation message */}
            {paymentStatus === "CANCELLED" && (
              <p className="text-sm text-orange-600 mt-2 text-center">
                Payment was cancelled. Please select a payment method and try
                again.
              </p>
            )}

            {/* ✅ Show failure message */}
            {paymentStatus === "FAILED" && (
              <p className="text-sm text-red-600 mt-2 text-center">
                Payment failed. Please check your payment details and try again.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
