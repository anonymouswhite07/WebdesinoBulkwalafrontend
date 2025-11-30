import { useEffect } from "react";
import useAuthStore from "../../store/auth.store.js";

const AppInitializer = ({ children }) => {
  const { checkauthstatus } = useAuthStore();

  useEffect(() => {
    checkauthstatus();
  }, []);

  return <>{children}</>;
};

export default AppInitializer;
