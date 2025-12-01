import {
  applySellerService,
  approveSellerService,
  checkauthService,
  forgotPasswordService,
  getAllUsersService,
  loginService,
  logoutService,
  registerService,
  rejectSellerService,
  resendVerificationService,
  resetPasswordService,
  verifyEmailService,
  changePasswordService,
  updateShippingAddressService,
  updateProfileService,
  registerSellerService,
  verifyOtpService,
  sendOtpService,
  deleteAddressService,
} from "@/services/auth.service";
import { create } from "zustand";
import useCartStore from "./cart.store";

// Helper functions for localStorage with mobile Safari handling
const getStoredAuthState = () => {
  if (typeof window === "undefined") return null;
  
  try {
    // Check if we're on mobile Safari
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    if (isIOS || isSafari) {
      console.log("Auth store: Detected iOS/Safari, checking localStorage for auth state");
    }
    
    const stored = localStorage.getItem("auth_state");
    if (stored) {
      const parsed = JSON.parse(stored);
      // Validate the stored state
      if (parsed && typeof parsed === 'object' && parsed.user && parsed.timestamp) {
        // Check if the stored state is not too old (e.g., 1 day)
        const oneDay = 24 * 60 * 60 * 1000;
        if (Date.now() - parsed.timestamp < oneDay) {
          if (isIOS || isSafari) {
            console.log("Auth store: Found valid stored auth state", parsed.user._id);
          }
          return { user: parsed.user, isLoggedIn: true };
        } else {
          if (isIOS || isSafari) {
            console.log("Auth store: Stored auth state is too old, ignoring");
          }
        }
      }
    }
  } catch (error) {
    console.warn("Auth store: Error reading stored auth state", error);
  }
  
  return null;
};

const setStoredAuthState = (user) => {
  if (typeof window === "undefined") return;
  
  try {
    // Check if we're on mobile Safari
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    if (user && typeof user === 'object') {
      const stateToStore = {
        user: { 
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified
        },
        timestamp: Date.now()
      };
      
      localStorage.setItem("auth_state", JSON.stringify(stateToStore));
      
      if (isIOS || isSafari) {
        console.log("Auth store: Saved auth state to localStorage", user._id);
      }
    } else {
      localStorage.removeItem("auth_state");
      
      if (isIOS || isSafari) {
        console.log("Auth store: Removed auth state from localStorage");
      }
    }
  } catch (error) {
    console.warn("Auth store: Error saving auth state to localStorage", error);
  }
};

export const useAuthStore = create((set, get) => ({
  user: null,
  isLoggedIn: false,
  allUsers: [],
  isLoading: true,
  pendingVerificationUser: null,
  error: null,

  signup: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const newRegisterUser = await registerService(userData);
      set({
        pendingVerificationUser: newRegisterUser,
        isLoading: false,
      });
      return { success: true, user: newRegisterUser };
    } catch (error) {
      let message =
        error.response?.data?.message || error.message || "Signup failed";
      set({ error: message, isLoading: false });

      return { success: false, error: message };
    }
  },

  sellerSignup: async (sellerData) => {
    set({ isLoading: true, error: null });
    try {
      const newSeller = await registerSellerService(sellerData);
      set({
        pendingVerificationUser: newSeller,
        isLoading: false,
      });
      return { success: true, user: newSeller };
    } catch (error) {
      let message =
        error.response?.data?.message ||
        error.message ||
        "Seller signup failed";
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const userData = await loginService(credentials);

      set({
        user: userData,
        isLoggedIn: true,
        isLoading: false,
        error: null,
      });
      
      // Save auth state to localStorage for mobile Safari
      setStoredAuthState(userData);

      // ✅ Merge guest cart with backend cart after login
      await useCartStore.getState().mergeGuestCart();

      return { success: true, user: userData };
    } catch (apiError) {
      const status = apiError.response?.status;
      const backendData = apiError.response?.data?.data; // ✅ consistent 'data' format

      const errorMessage =
        apiError.response?.data?.message ||
        apiError.response?.data?.error ||
        apiError.message ||
        "Failed to login. Please try again.";

      // ✅ detect 403 email not verified (without breaking structure)
      if (status === 403 && backendData?._id) {
        return {
          success: false,
          error: errorMessage,
          unverifiedUser: backendData, // always { _id, email }
        };
      }

      set({
        user: null,
        isLoggedIn: false,
        isLoading: false,
        error: errorMessage,
      });

      return { success: false, error: errorMessage };
    }
  },

  otpLoginSend: async (phone) => {
    set({ isLoading: true, error: null });
    try {
      await sendOtpService(phone);
      set({ isLoading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to send OTP";
      set({ isLoading: false, error: message });
      return { success: false, error: message };
    }
  },

  otpLoginVerify: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const user = await verifyOtpService(data);
      set({ user, isLoggedIn: true, isLoading: false });
      
      // Save auth state to localStorage for mobile Safari
      setStoredAuthState(user);

      // ✅ Merge guest cart with backend cart after OTP login
      await useCartStore.getState().mergeGuestCart();

      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.message || "Invalid or expired OTP";
      set({ isLoading: false, error: message });
      return { success: false, error: message };
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });

    try {
      await logoutService();
      const { clearCartOnLogout } = useCartStore.getState();
      clearCartOnLogout();

      set({ user: null, isLoggedIn: false, isLoading: false, error: null });
      
      // Clear auth state from localStorage
      setStoredAuthState(null);

      return { success: true };
    } catch (apiError) {
      const errorMessage =
        apiError.message || "Logout failed. Please try again.";

      // Still clear cart even if backend fails, for safety
      const { clearCartOnLogout } = useCartStore.getState();
      clearCartOnLogout();

      set({
        user: null,
        isLoggedIn: false,
        isLoading: false,
        error: errorMessage,
      });
      
      // Clear auth state from localStorage
      setStoredAuthState(null);

      return { success: false, error: errorMessage };
    }
  },

  updateAddress: async ({ address, index }) => {
    set({ isLoading: true, error: null });

    try {
      const payload = {
        address, // flat address object
        index: index ?? undefined,
      };

      const updatedUser = await updateShippingAddressService(payload);

      set({ user: updatedUser, isLoading: false });
      
      // Update stored auth state
      setStoredAuthState(updatedUser);

      return { success: true, user: updatedUser };
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Failed to update address";

      set({ isLoading: false, error: msg });
      return { success: false, error: msg };
    }
  },

  removeAddress: async (index) => {
    set({ isLoading: true, error: null });

    try {
      const updatedUser = await deleteAddressService(index);
      set({ user: updatedUser, isLoading: false });
      
      // Update stored auth state
      setStoredAuthState(updatedUser);

      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete address";

      set({ isLoading: false, error: message });
      return { success: false, error: message };
    }
  },

  checkauthstatus: async () => {
    set({ isLoading: true });

    try {
      // First, check if we have stored auth state (especially for mobile Safari)
      const storedState = getStoredAuthState();
      if (storedState) {
        // Set the stored state temporarily while we verify with the server
        set({ user: storedState.user, isLoggedIn: true, isLoading: true });
      }

      const user = await checkauthService();
      if (user) {
        set({ user, isLoggedIn: true });
        // Save the verified auth state
        setStoredAuthState(user);
      } else {
        set({ user: null, isLoggedIn: false });
        // Clear stored auth state
        setStoredAuthState(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error.message);
      // On error, we'll keep the stored state if we had it, but mark as not logged in
      // This helps with mobile Safari where network requests might fail
      const currentState = get();
      if (currentState.user !== null || currentState.isLoggedIn !== false) {
        // Only clear state if we don't have stored state as fallback
        const storedState = getStoredAuthState();
        if (!storedState) {
          set({ user: null, isLoggedIn: false });
          // Clear stored auth state
          setStoredAuthState(null);
        }
      }
    } finally {
      set({ isLoading: false });
    }
  },

  verifyEmail: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      await verifyEmailService(credentials);
      set({ isLoading: false });
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Verification failed";
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  resendVerification: async (userid) => {
    set({ isLoading: true, error: null });
    try {
      await resendVerificationService(userid);
      set({ isLoading: false });
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Resend failed";
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  forgetPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      await forgotPasswordService(email);
      set({ isLoading: false });
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to send reset link";
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  changePassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      await changePasswordService(email);
      set({ isLoading: false });
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to send reset link";
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  resetPassword: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      await resetPasswordService(credentials);
      set({ isLoading: false });
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Password reset failed";
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  applySeller: async (sellerData) => {
    set({ isLoading: true });
    try {
      const user = await applySellerService(sellerData);
      set({ user, isLoading: false });
      
      // Update stored auth state
      setStoredAuthState(user);

      return { success: true, user };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to apply for seller";
      set({ isLoading: false, error: message });
      return { success: false, error: message };
    }
  },

  fetchAllUsers: async () => {
    try {
      const users = await getAllUsersService();
      set({ allUsers: users });
      return { success: true, users };
    } catch (error) {
      set({ error: "Failed to fetch users" });
      return { success: false, error };
    }
  },

  approveSeller: async (userid) => {
    try {
      await approveSellerService(userid);
      await get().fetchAllUsers();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  },

  rejectSeller: async (userid) => {
    try {
      await rejectSellerService(userid);
      await get().fetchAllUsers();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  },
  updateProfile: async (profileData) => {
    set({ isLoading: true, error: null });
    try {
      const updatedUser = await updateProfileService(profileData);
      set({ user: updatedUser, isLoading: false });
      
      // Update stored auth state
      setStoredAuthState(updatedUser);

      return { success: true, user: updatedUser };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to update profile";
      set({ isLoading: false, error: message });
      return { success: false, error: message };
    }
  },
}));

export default useAuthStore;