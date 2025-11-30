import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useAuthStore } from "@/store/auth.store";
import ScrollToTop from "../ScrollToTop";
import SignupPopup from "../SignupPopup";
import WhatsAppFloatingButton from "../WhatsAppFloatingButton"; 

const Mainlayout = () => {
  const { user } = useAuthStore(); // ✅ get logged-in user
  const location = useLocation();  // ✅ to hide on login/signup

  // Auth check is handled in AppInitializer, no need to duplicate here

  // Hide WhatsApp button on these routes
  const hideFor = ["/login", "/signup"];
  const shouldShowWhatsApp =
    user && !hideFor.includes(location.pathname.toLowerCase());

  return (
    <>
      <ScrollToTop />
      <Navbar />

      <Outlet />

      <Toaster position="top-right" richColors />
      <Footer />

      <SignupPopup />

      {/* ✅ Show floating WhatsApp icon only after login and NOT on login/signup */}
      {shouldShowWhatsApp && <WhatsAppFloatingButton />}
    </>
  );
};

export default Mainlayout;