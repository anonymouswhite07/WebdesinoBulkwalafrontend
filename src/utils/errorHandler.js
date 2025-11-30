/**
 * Standardized error handling utility for API errors
 * Provides consistent error handling across all services
 */

/**
 * Extracts error message from API error response
 * @param {Error} error - The error object from axios
 * @returns {string} - User-friendly error message
 */
export const getErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.message) {
    return error.message;
  }
  return "An unexpected error occurred";
};

/**
 * Checks if error is a 401 Unauthorized error
 * @param {Error} error - The error object
 * @returns {boolean}
 */
export const isUnauthorizedError = (error) => {
  return error.response?.status === 401;
};

/**
 * Checks if error is a network error (no response)
 * @param {Error} error - The error object
 * @returns {boolean}
 */
export const isNetworkError = (error) => {
  return !error.response && error.request;
};

/**
 * Handles API errors consistently
 * Returns null for 401 errors (expected when not authenticated)
 * Throws other errors for upstream handling
 * @param {Error} error - The error object
 * @returns {null|void} - Returns null for 401, throws otherwise
 */
export const handleApiError = (error) => {
  // Silently handle 401 errors - user is not authenticated (expected behavior)
  if (isUnauthorizedError(error)) {
    return null;
  }
  // Re-throw other errors for upstream handling
  throw error;
};

/**
 * Gets error status code
 * @param {Error} error - The error object
 * @returns {number|null} - Status code or null
 */
export const getErrorStatus = (error) => {
  return error.response?.status || null;
};

