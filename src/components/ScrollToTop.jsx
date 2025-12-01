import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Detect if we're on mobile device
    const isMobile = typeof navigator !== 'undefined' && /Mobi|Android/i.test(navigator.userAgent);
    const isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    // For mobile devices, especially iOS, we need to scroll to top with a slight delay
    // to ensure the page has fully rendered
    if (isMobile || isIOS) {
      // Use a small timeout to ensure DOM is ready
      const timer = setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }, 100);
      
      return () => clearTimeout(timer);
    } else {
      // For desktop, scroll immediately
      window.scrollTo({
        top: 0,
        behavior: "smooth",
        // Add smooth scrolling with easing for better UX
        left: 0,
      });
    }
  }, [pathname]);

  return null;
}