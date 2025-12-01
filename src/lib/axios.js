import axios from "axios";

// Detect if we're on iOS/Safari
const isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
const isSafari = typeof navigator !== 'undefined' && /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
const isMobile = typeof navigator !== 'undefined' && /Mobi|Android/i.test(navigator.userAgent);
// Detect Chrome on iOS (which is actually Safari)
const isChromeOnIOS = typeof navigator !== 'undefined' && /CriOS/i.test(navigator.userAgent);

// Log environment info for debugging
if (isIOS || isSafari || isMobile || isChromeOnIOS) {
  console.log("Axios config: Detected mobile/iOS/Safari environment", {
    isIOS,
    isSafari,
    isMobile,
    isChromeOnIOS,
    userAgent: navigator.userAgent
  });
}

// Use the VITE_API_BASE_URL environment variable - no fallback to localhost
const baseURL = import.meta.env.VITE_API_BASE_URL;

// Log the baseURL for debugging
console.log("Axios config: Using baseURL:", baseURL);

// Enhanced axios configuration for Safari compatibility
export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true, // IMPORTANT: allows sending cookies
  // Add timeout to prevent hanging requests
  timeout: 30000, // 30 seconds
});

// Add request interceptor for Safari debugging
axiosInstance.interceptors.request.use(
  (config) => {
    // Log requests for iOS/Safari debugging
    if (isIOS || isSafari || isMobile || isChromeOnIOS) {
      console.log("Axios request:", {
        url: config.url,
        method: config.method,
        headers: config.headers,
        withCredentials: config.withCredentials
      });
    }
    
    // For Safari, ensure we're not using cached requests (only for GET requests)
    if ((isSafari || isIOS || isChromeOnIOS) && config.method?.toUpperCase() === 'GET') {
      config.headers['Cache-Control'] = 'no-cache';
      config.headers['Pragma'] = 'no-cache';
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Track if we're already refreshing to prevent infinite loops
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Response interceptor — auto refresh token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Log errors for iOS/Safari debugging
    if (isIOS || isSafari || isMobile || isChromeOnIOS) {
      console.log("Axios interceptor: Request failed", {
        url: originalRequest?.url,
        status: error.response?.status,
        message: error.message,
        isRetry: originalRequest._retry,
        isRefreshTokenRequest: originalRequest.url?.includes('/users/refresh-token')
      });
    }

    // If access token expired (401) and this isn't a retry or refresh token request
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/users/refresh-token')) {
      if (isRefreshing) {
        // If we're already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          // Don't set Authorization header since backend uses cookies
          return axiosInstance(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call refresh endpoint — COOKIE will be used automatically
        if (isIOS || isSafari || isMobile || isChromeOnIOS) {
          console.log("Axios interceptor: Attempting to refresh token");
        }
        
        const { data } = await axiosInstance.post("/users/refresh-token", {}, { 
          withCredentials: true,
          // Add timeout to prevent hanging requests
          timeout: 15000
        });
        
        const newAccessToken = data?.data?.accessToken;
        if (!newAccessToken) {
          throw new Error("No access token returned!");
        }

        // Process queued requests with new token
        processQueue(null, newAccessToken);

        // Retry original request (cookies will be sent automatically)
        return axiosInstance(originalRequest);
      } catch (err) {
        // Refresh failed → logout and clear queue
        console.error("Token refresh failed:", err.message);
        processQueue(err, null);
        
        // Check if the error is due to missing cookies (user not logged in)
        const isMissingCookies = err.response?.status === 401 && 
          (err.response?.data?.message?.includes("No refresh token") || 
           err.response?.data?.message?.includes("Unauthorized request"));
        
        // If it's a missing cookies issue, don't redirect to login as the user might be a guest
        // Just reject the promise and let the calling code handle it appropriately
        if (isMissingCookies) {
          console.log("User not logged in - continuing as guest");
          return Promise.reject(err);
        }
        
        // For other refresh token failures, redirect to login
        if (typeof window !== 'undefined') {
          // Only redirect if we're not already on the login page
          if (window.location.pathname !== '/login') {
            console.log("Redirecting to login due to token refresh failure");
            window.location.href = '/login';
          }
        }
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// SPECIAL FIX FOR SAFARI NETWORK ERRORS
// Add a retry mechanism specifically for Safari network errors
const originalPost = axiosInstance.post;
const originalGet = axiosInstance.get;
const originalPut = axiosInstance.put;
const originalDelete = axiosInstance.delete;

// Wrapper function to add retry logic for Safari
const safariRetryWrapper = (originalMethod) => {
  return async function (...args) {
    const [url, data, config = {}] = args;
    
    try {
      return await originalMethod.call(this, url, data, config);
    } catch (error) {
      // If it's a network error on Safari, try once more
      if ((isIOS || isSafari || isChromeOnIOS) && 
          (error.code === 'NETWORK_ERROR' || 
           error.message.includes('Network Error') ||
           error.message.includes('Failed to fetch'))) {
        
        console.log("Safari network error detected, retrying once...");
        
        // Wait a bit before retry
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        try {
          return await originalMethod.call(this, url, data, config);
        } catch (retryError) {
          console.error("Retry failed:", retryError.message);
          throw retryError;
        }
      }
      
      throw error;
    }
  };
};

// Apply retry wrapper to all methods for Safari
if (isIOS || isSafari || isChromeOnIOS) {
  axiosInstance.post = safariRetryWrapper(originalPost);
  axiosInstance.get = safariRetryWrapper(originalGet);
  axiosInstance.put = safariRetryWrapper(originalPut);
  axiosInstance.delete = safariRetryWrapper(originalDelete);
}