import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
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