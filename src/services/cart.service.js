import { axiosInstance } from "@/lib/axios";

// Wrapper function with timeout protection and better error handling
const apiCallWithTimeout = async (promise, timeout = 10000) => {
  // Only apply timeout in browser environment
  if (typeof window === "undefined") {
    return await promise;
  }
  
  const timeoutPromise = new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Request timeout')), timeout)
  );
  
  try {
    return await Promise.race([promise, timeoutPromise]);
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
};

// Enhanced wrapper with retry logic for mobile connections
const apiCallWithRetry = async (apiCall, retries = 2, timeout = 10000) => {
  for (let i = 0; i <= retries; i++) {
    try {
      const result = await apiCallWithTimeout(apiCall(), timeout);
      return result;
    } catch (error) {
      console.warn(`API call attempt ${i + 1} failed:`, error.message);
      
      // Don't retry on certain errors
      if (error.response?.status === 401 || error.response?.status === 403 || error.response?.status === 404) {
        throw error;
      }
      
      // If this was the last attempt, throw the error
      if (i === retries) {
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
    }
  }
};

export const addToCartService = async (productId, quantity) => {
  try {
    const res = await apiCallWithRetry(() => 
      axiosInstance.post("/cart", { productId, quantity })
    );
    return res.data.data;
  } catch (error) {
    console.warn("Error in addToCartService:", error);
    throw error;
  }
};

export const fetchCartService = async () => {
  try {
    const res = await apiCallWithRetry(() => 
      axiosInstance.get("/cart")
    );
    return res.data.data;
  } catch (error) {
    console.warn("Error in fetchCartService:", error);
    throw error;
  }
};

export const updateCartItemService = async (productId, quantity) => {
  try {
    const res = await apiCallWithRetry(() => 
      axiosInstance.put("/cart", { productId, quantity })
    );
    return res.data.data;
  } catch (error) {
    console.warn("Error in updateCartItemService:", error);
    throw error;
  }
};

export const removeCartItemService = async (productId) => {
  try {
    const res = await apiCallWithRetry(() => 
      axiosInstance.delete(`/cart/remove/${productId}`)
    );
    return res.data.data;
  } catch (error) {
    console.warn("Error in removeCartItemService:", error);
    throw error;
  }
};

export const clearCartService = async () => {
  try {
    const res = await apiCallWithRetry(() => 
      axiosInstance.delete("/cart/clear-cart")
    );
    return res.data.data;
  } catch (error) {
    console.warn("Error in clearCartService:", error);
    throw error;
  }
};

// ✅ Apply coupon
export const applyCouponService = async (couponCode) => {
  try {
    const res = await apiCallWithRetry(() => 
      axiosInstance.post("/cart/apply-coupon", {
        couponCode,
      })
    );
    return res.data.data;
  } catch (error) {
    console.warn("Error in applyCouponService:", error);
    throw error;
  }
};

// ✅ Remove coupon
export const removeCouponService = async () => {
  try {
    const res = await apiCallWithRetry(() => 
      axiosInstance.post("/cart/remove-coupon")
    );
    return res.data.data;
  } catch (error) {
    console.warn("Error in removeCouponService:", error);
    throw error;
  }
};

export const applyReferralService = async (data) => {
  try {
    const res = await apiCallWithRetry(() => 
      axiosInstance.post("/cart/apply-referral", data)
    );
    return res.data.data;
  } catch (error) {
    console.warn("Error in applyReferralService:", error);
    throw error;
  }
};

export const removeReferralService = async () => {
  try {
    const res = await apiCallWithRetry(() => 
      axiosInstance.post("/cart/remove-referral")
    );
    return res.data.data;
  } catch (error) {
    console.warn("Error in removeReferralService:", error);
    throw error;
  }
};