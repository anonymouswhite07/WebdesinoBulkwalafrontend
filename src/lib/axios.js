import axios from "axios";

// Detect if we're on iOS/Safari
const isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
const isSafari = typeof navigator !== 'undefined' && /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

// Log environment info for debugging
if (isIOS || isSafari) {
  console.log("Axios config: Detected iOS/Safari environment");
}

// Determine base URL with protocol awareness for mobile
let baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

// On iOS/Safari, ensure we're using HTTPS if the current page is HTTPS
if (typeof window !== 'undefined' && window.location.protocol === 'https:' && baseURL.startsWith('http:')) {
  console.log("Axios config: Upgrading to HTTPS for secure context");
  baseURL = baseURL.replace('http:', 'https:');
}

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true, // IMPORTANT: allows sending cookies
});

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
    if (isIOS || isSafari) {
      console.log("Axios interceptor: Request failed", {
        url: originalRequest?.url,
        status: error.response?.status,
        message: error.message
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
        const { data } = await axiosInstance.post("/users/refresh-token", {}, { withCredentials: true });
        
        const newAccessToken = data?.data?.accessToken;
        if (!newAccessToken) throw new Error("No access token returned!");

        // Process queued requests with new token
        processQueue(null, newAccessToken);

        // Retry original request (cookies will be sent automatically)
        return axiosInstance(originalRequest);
      } catch (err) {
        // Refresh failed → logout and clear queue
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);