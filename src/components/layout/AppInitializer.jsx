import { useEffect, useState } from "react";
import useAuthStore from "../../store/auth.store.js";

const AppInitializer = ({ children }) => {
  const { checkauthstatus, isLoading } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      // Check if we're on mobile Safari
      const isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isSafari = typeof navigator !== 'undefined' && /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      
      if (isIOS || isSafari) {
        console.log("AppInitializer: Detected iOS/Safari, starting auth check");
      }
      
      try {
        await checkauthstatus();
      } catch (error) {
        console.error("AppInitializer: Error during auth check", error);
      } finally {
        setIsChecking(false);
        if (isIOS || isSafari) {
          console.log("AppInitializer: Auth check completed");
        }
      }
    };

    initializeApp();
  }, []);

  // Show a simple loading indicator while checking auth status
  if (isChecking || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#02066F] mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AppInitializer;