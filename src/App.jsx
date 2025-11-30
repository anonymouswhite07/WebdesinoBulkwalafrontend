import "./index.css";
import { createBrowserRouter } from "react-router-dom";
import Mainlayout from "./components/layout/Mainlayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerificationPage from "./pages/VerificationPage";
import AdminDashboard from "./Admin/pages/AdminDashboard";
import Products from "./pages/Products";
import ProtectedRoutes from "./components/ProtectedRoutes";
import TermsAndConditions from "./requiredpages/Term&Condition";
import PrivacyPolicy from "./requiredpages/PrivacyPolicy";
import ShippingPolicy from "./requiredpages/ShipingPolicy";
import RefundAndReturnPolicy from "./requiredpages/Refund&ReturnPolicy";
import Profile from "./pages/Profile";
import SellerDashboard from "./Seller/pages/SellerDashboard";
import Contact from "./pages/Contact";
import About from "./pages/About";
import ProductDetail from "./pages/ProductDetail";
import ChangePassword from "./pages/ChangePassword";
import ResetPassword from "./pages/ResetPassword";
import Cart from "./pages/Cart";
import ForgotPassword from "./pages/ForgotPassword";
import PaymentPage from "./pages/paymentPage";
import OrderSuccess from "./pages/OrderSuccess";
import OrderDetail from "./pages/OrderDetail";
import MyOrders from "./pages/Myorders";
import Wishlist from "./pages/Wishlist";
import OrderTrack from "./pages/OrderTrack";
import SellerSignup from "./Seller/pages/SellerSignup";

const ROLES = {
  ADMIN: "admin",
  SELLER: "seller",
  CUSTOMER: "customer",
};

const App = createBrowserRouter([
  {
    path: "/",
    element: <Mainlayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "become-seller",
        element: <SellerSignup />,
      },
      {
        path: "verify/:userid",
        element: <VerificationPage />,
      },
      {
        path: "/products",
        element: <Products />,
      },

      {
        path: "/contact",
        element: <Contact />,
      },

      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/product/:slug",
        element: <ProductDetail />,
      },
      {
        path: "/terms-and-conditions",
        element: <TermsAndConditions />,
      },
      {
        path: "/privacy-policy",
        element: <PrivacyPolicy />,
      },
      {
        path: "/shipping-policy",
        element: <ShippingPolicy />,
      },
      {
        path: "/refund-and-return-policy",
        element: <RefundAndReturnPolicy />,
      },

      // Authenticated Routes (Require Login)
      {
        path: "/change-password",
        element: <ChangePassword />,
      },
      {
        path: "/reset-password/:userid/:token",
        element: <ResetPassword />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },

      {
        path: "/cart",
        element: <Cart />,
      },

      {
        path: "/payment",
        element: (
          <ProtectedRoutes>
            <PaymentPage />
          </ProtectedRoutes>
        ),
      },

      {
        path: "/order-success",
        element: (
          <ProtectedRoutes>
            <OrderSuccess />
          </ProtectedRoutes>
        ),
      },

      {
        path: "/profile",
        element: (
          <ProtectedRoutes
            allowedRoles={[ROLES.ADMIN, ROLES.SELLER, ROLES.CUSTOMER]}
          >
            <Profile />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/my-orders",
        element: (
          <ProtectedRoutes allowedRoles={[ROLES.CUSTOMER]}>
            <MyOrders />
          </ProtectedRoutes>
        ),
      },

      {
        path: "order/:orderId",
        element: (
          <ProtectedRoutes allowedRoles={[ROLES.CUSTOMER]}>
            <OrderDetail />
          </ProtectedRoutes>
        ),
      },

      {
        path: "/wishlist",
        element: (
          <ProtectedRoutes>
            <Wishlist />
          </ProtectedRoutes>
        ),
      },

      {
        path: "/track/:orderId",
        element: (
          <ProtectedRoutes allowedRoles={[ROLES.CUSTOMER]}>
            <OrderTrack />
          </ProtectedRoutes>
        ),
      },
      // Admin Routes (Require Admin Role)
      {
        path: "/admin",
        element: (
          <ProtectedRoutes allowedRoles={[ROLES.ADMIN]}>
            <AdminDashboard />
          </ProtectedRoutes>
        ),
      },

      // Seller Routes (Require Seller Role)
      {
        path: "/seller",
        element: (
          <ProtectedRoutes allowedRoles={[ROLES.SELLER]}>
            <SellerDashboard />
          </ProtectedRoutes>
        ),
      },
    ],
  },
]);

export default App;
