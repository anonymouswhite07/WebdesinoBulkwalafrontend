import { axiosInstance } from "@/lib/axios";

export const registerService = async (userData) => {
  const res = await axiosInstance.post("/users/register", userData);
  return res.data.data;
};

export const registerSellerService = async (sellerData) => {
  const res = await axiosInstance.post(
    "/users/register-seller",
    sellerData
  );
  return res.data.data;
};

export const loginService = async (credentials) => {
  try {
    const res = await axiosInstance.post("/users/login", credentials, {
      withCredentials: true,
    });
    return res.data.data;
  } catch (error) {
    // Special handling for Safari network errors
    const isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = typeof navigator !== 'undefined' && /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    if ((isIOS || isSafari) && 
        (error.code === 'NETWORK_ERROR' || 
         error.message.includes('Network Error') ||
         error.message.includes('Failed to fetch'))) {
      
      console.log("Safari network error detected in loginService, retrying once...");
      
      // Wait a bit before retry
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Retry once
      try {
        const res = await axiosInstance.post("/users/login", credentials, {
          withCredentials: true,
        });
        return res.data.data;
      } catch (retryError) {
        console.error("Login retry failed:", retryError.message);
        throw retryError;
      }
    }
    
    throw error;
  }
};

// Send OTP
export const sendOtpService = async (phone) => {
  try {
    const res = await axiosInstance.post("/users/send-otp", { phone }, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    // Special handling for Safari network errors
    const isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = typeof navigator !== 'undefined' && /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    if ((isIOS || isSafari) && 
        (error.code === 'NETWORK_ERROR' || 
         error.message.includes('Network Error') ||
         error.message.includes('Failed to fetch'))) {
      
      console.log("Safari network error detected in sendOtpService, retrying once...");
      
      // Wait a bit before retry
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Retry once
      try {
        const res = await axiosInstance.post("/users/send-otp", { phone }, {
          withCredentials: true,
        });
        return res.data;
      } catch (retryError) {
        console.error("Send OTP retry failed:", retryError.message);
        throw retryError;
      }
    }
    
    throw error;
  }
};

// Verify OTP
export const verifyOtpService = async (data) => {
  try {
    const res = await axiosInstance.post("/users/verify-otp", data, {
      withCredentials: true,
    });
    return res.data.data; // returns user
  } catch (error) {
    // Special handling for Safari network errors
    const isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = typeof navigator !== 'undefined' && /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    if ((isIOS || isSafari) && 
        (error.code === 'NETWORK_ERROR' || 
         error.message.includes('Network Error') ||
         error.message.includes('Failed to fetch'))) {
      
      console.log("Safari network error detected in verifyOtpService, retrying once...");
      
      // Wait a bit before retry
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Retry once
      try {
        const res = await axiosInstance.post("/users/verify-otp", data, {
          withCredentials: true,
        });
        return res.data.data;
      } catch (retryError) {
        console.error("Verify OTP retry failed:", retryError.message);
        throw retryError;
      }
    }
    
    throw error;
  }
};

export const updateShippingAddressService = async ({ address, index }) => {
  const res = await axiosInstance.put(
    "/users/address",
    { address, index },
    { withCredentials: true }
  );
  return res.data.data;
};

export const deleteAddressService = async (index) => {
  const res = await axiosInstance.delete(`/users/address/${index}`, {
    withCredentials: true,
  });
  return res.data.data;
};

export const checkauthService = async () => {
  try {
    const res = await axiosInstance.get("/users/profile", {
      withCredentials: true,
    });
    return res.data.data;
  } catch (error) {
    // Silently handle 401 errors - user is not authenticated (expected behavior)
    if (error.response?.status === 401) {
      return null;
    }
    // Re-throw other errors
    throw error;
  }
};

export const verifyEmailService = async ({ userid, token }) => {
  const res = await axiosInstance.post(`/users/verify/${userid}`, {
    token,
  }, {
    withCredentials: true,
  });
  return res.data;
};

export const resendVerificationService = async (userid) => {
  const res = await axiosInstance.post(
    `/users/resend-verification/${userid}`,
    {},
    {
      withCredentials: true,
    }
  );
  return res.data;
};

export const forgotPasswordService = async (email) => {
  const res = await axiosInstance.post("/users/forget-password", { email }, {
    withCredentials: true,
  });
  return res.data;
};

export const changePasswordService = async (email) => {
  const res = await axiosInstance.post("/users/change-password", { email }, {
    withCredentials: true,
  });
  return res.data;
};

export const resetPasswordService = async (credentials) => {
  const { userid, token, newPassword } = credentials;
  const res = await axiosInstance.post(
    `/users/reset-password/${userid}/${token}`,
    { newPassword },
    {
      withCredentials: true,
    }
  );
  return res.data;
};

//  Apply for seller
export const applySellerService = async (sellerData) => {
  const res = await axiosInstance.post("/users/apply-seller", sellerData, {
    withCredentials: true,
  });
  return res.data.data;
};

//  Fetch all users (admin only)
export const getAllUsersService = async () => {
  const res = await axiosInstance.get("/users", { withCredentials: true });
  return res.data.data;
};

//  Approve pending seller
export const approveSellerService = async (userid) => {
  const res = await axiosInstance.put(
    `/users/sellers/approve/${userid}`,
    {},
    { withCredentials: true }
  );
  return res.data.data;
};

// Reject pending seller
export const rejectSellerService = async (userid) => {
  const res = await axiosInstance.put(
    `/users/sellers/reject/${userid}`,
    {},
    { withCredentials: true }
  );
  return res.data.data;
};

//update profile
export const updateProfileService = async (profileData) => {
  const res = await axiosInstance.put("/users/update", profileData, {
    withCredentials: true,
  });
  return res.data.data;
};

// Logout service
export const logoutService = async () => {
  await axiosInstance.post("/users/logout", {}, {
    withCredentials: true,
  });
  return { success: true };
};
