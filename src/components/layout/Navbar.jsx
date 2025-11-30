import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "@/store/auth.store";
import useCartStore from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";
import { useProductStore } from "@/store/product.store";
import { useOfferStore } from "@/store/offer.store";

import { toast } from "sonner";

export default function Navbar() {
  const { user, logout, checkauthstatus } = useAuthStore();
  const { totalItems, fetchCart } = useCartStore();
  const { wishlist, fetchWishlist } = useWishlistStore();
  const { products, fetchProducts } = useProductStore();
  const { activeOffer, fetchActiveOffer, timeLeft } = useOfferStore();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [listening, setListening] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState(
    JSON.parse(localStorage.getItem("recentSearches") || "[]")
  );

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // ✅ New state for hamburger
  const dropdownRef = useRef();
  const searchRef = useRef();
  const suggestionRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Load products and offers (auth is checked in AppInitializer)
  useEffect(() => {
    fetchProducts();
    fetchActiveOffer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // fetchProducts and fetchActiveOffer are stable from zustand stores

  // ✅ Load guest cart and fetch cart/wishlist
  useEffect(() => {
    const cartStore = useCartStore.getState();
    cartStore.loadGuestCart();
    cartStore.fetchCart();
    
    // Fetch wishlist only when user is logged in
    if (user && user._id) {
      fetchWishlist();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]); // fetchCart and fetchWishlist are stable from zustand stores

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(event.target) &&
        !searchRef.current.contains(event.target)
      ) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Clear suggestions when route changes
  useEffect(() => {
    setSuggestions([]);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // ✅ Voice Search
  const handleVoiceSearch = () => {
    if (!("webkitSpeechRecognition" in window)) {
      toast.error("Voice search not supported in this browser");
      return;
    }
    try {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.lang = "en-IN";
      recognition.interimResults = false;

      recognition.onstart = () => {
        setListening(true);
        toast.info("🎤 Listening... speak now");
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.trim();
        setSearchQuery(transcript);
        performSearch(transcript);
      };

      recognition.onerror = (event) => {
        setListening(false);
        if (event.error === "not-allowed") {
          toast.error("Microphone permission denied.");
        } else {
          toast.error("Voice recognition failed. Try again.");
        }
      };

      recognition.onend = () => setListening(false);
      recognition.start();
    } catch (err) {
      console.error("Speech recognition error:", err);
      toast.error("Voice recognition not supported or failed.");
      setListening(false);
    }
  };

  // ✅ Search logic
  const performSearch = (queryInput) => {
    const query =
      typeof queryInput === "function" ? queryInput(searchQuery) : queryInput;
    if (!query.trim()) return;

    const keyword = query.toLowerCase().replace(/\s+/g, "");
    const filtered = products.filter((p) => {
      const normalize = (str) => (str || "").toLowerCase().replace(/\s+/g, "");
      return (
        normalize(p.title).includes(keyword) ||
        normalize(p.description).includes(keyword) ||
        normalize(p.category?.name).includes(keyword) ||
        normalize(p.subcategory?.name).includes(keyword)
      );
    });

    if (filtered.length > 0) toast.success(`Found ${filtered.length} results`);
    else toast.info("No matches found");

    const updated = [query, ...recentSearches.filter((i) => i !== query)].slice(
      0,
      5
    );
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));

    setSuggestions([]); // ✅ close dropdown
    navigate(`/products?search=${encodeURIComponent(query)}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    performSearch(searchQuery);
    setSuggestions([]);
  };

  // ✅ Smart suggestions logic
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }
    const keyword = searchQuery.toLowerCase().replace(/\s+/g, "");
    const matched = products
      .filter((p) => {
        const normalize = (s) => (s || "").toLowerCase().replace(/\s+/g, "");
        return (
          normalize(p.title).includes(keyword) ||
          normalize(p.category?.name).includes(keyword) ||
          normalize(p.subcategory?.name).includes(keyword)
        );
      })
      .slice(0, 5)
      .map((p) => p.title);
    setSuggestions([...new Set([...matched, ...recentSearches])].slice(0, 5));
  }, [searchQuery, products]);

  // ✅ Logout
  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      toast.success("Logged out successfully!");
      navigate("/login");
    } else {
      toast.error(result.error || "Logout failed.");
    }
    setDropdownOpen(false);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <>
      {/* 🔥 Flash Offer Banner */}
      {activeOffer?.isActive && timeLeft > 0 && (
        <div className="bg-gradient-to-r from-[#02066F] to-[#04127A] text-white text-center py-2 animate-pulse">
          <span className="font-semibold">
            ⚡ {activeOffer.discountPercent}% OFF upto ₹
            {activeOffer.maxDiscountAmount} Flash Sale!
          </span>{" "}
          <span className="ml-2 text-yellow-300 font-bold">
            Ends in {formatTime(timeLeft)}
          </span>
        </div>
      )}

      <header className="w-full border-b border-gray-300 bg-white relative z-50">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between p-4">
          {/* 🧩 Logo - Left */}
          <img
            src="https://ik.imagekit.io/bulkwala/demo/bulkwalalogo.jpg?updatedAt=1762145179195"
            alt="Bulkwala Logo"
            className="w-20 h-20 cursor-pointer"
            onClick={() => navigate("/")}
          />

          {/* 🔍 Search Bar (Hidden on Mobile) */}
          <div className="hidden md:block w-[450px]">
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center bg-gray-100 rounded-md px-4 py-2"
            >
              <ion-icon
                name="search-outline"
                class="text-xl text-gray-500 mr-2"
              ></ion-icon>
              <input
                ref={searchRef}
                type="text"
                placeholder="Search Your Products Here"
                className="bg-transparent flex-1 outline-none text-sm md:text-base"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value.trim()) setSuggestions(recentSearches);
                }}
                onFocus={() => {
                  if (searchQuery.trim()) setSuggestions(recentSearches);
                }}
                onBlur={() => setTimeout(() => setSuggestions([]), 150)}
              />
              <ion-icon
                name={listening ? "mic" : "mic-outline"}
                class={`text-xl ml-2 cursor-pointer transition-all ${
                  listening ? "text-red-500 animate-pulse" : "text-gray-500"
                }`}
                onClick={handleVoiceSearch}
              ></ion-icon>
            </form>

            {/* 🔽 Suggestion Dropdown */}
            {suggestions.length > 0 && (
              <div
                ref={suggestionRef}
                className="absolute bg-white shadow-md rounded-md mt-1 w-[450px] border border-gray-200 z-50"
              >
                {suggestions.map((item, idx) => (
                  <div
                    key={idx}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
                    onClick={() => {
                      setSearchQuery(item);
                      performSearch(item);
                      setSuggestions([]);
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ❤️ 🛒 👤 + Hamburger */}
          <div className="flex items-center space-x-4">
            {/* Hamburger only on mobile */}
            <button
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-md border border-gray-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <ion-icon
                name={mobileMenuOpen ? "close" : "menu"}
                class="text-2xl text-gray-800"
              ></ion-icon>
            </button>

            {/* Desktop Icons */}
            <div className="hidden md:flex items-center space-x-6 relative">
              <Link
                to="/wishlist"
                className="relative flex items-center space-x-1"
              >
                <ion-icon
                  name="heart-outline"
                  className="text-xl text-[#02066F]"
                ></ion-icon>
                <span className="text-base text-[#02066F] font-medium">
                  Wishlist
                </span>
                {wishlist.length > 0 && (
                  <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              <Link to="/cart" className="relative flex items-center space-x-1">
                <ion-icon
                  name="cart-outline"
                  className="text-xl text-[#02066F]"
                ></ion-icon>
                <span className="text-base text-[#02066F] font-medium">
                  Cart
                </span>
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>

              {user ? (
                <div ref={dropdownRef} className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-md hover:bg-gray-200 transition"
                  >
                    <ion-icon
                      name="person-circle-outline"
                      class="text-xl text-[#02066F]"
                    ></ion-icon>
                    <span className="text-base text-[#02066F] font-medium">
                      {user.name}
                    </span>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-md z-50">
                      {user.role === "admin" && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={() => setDropdownOpen(false)}
                        >
                          Manage Dashboard
                        </Link>
                      )}
                      {user.role === "seller" && (
                        <Link
                          to="/seller"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={() => setDropdownOpen(false)}
                        >
                          Manage Dashboard
                        </Link>
                      )}
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        My Profile
                      </Link>
                      {user.role === "customer" && (
                        <Link
                          to="/my-orders"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={() => setDropdownOpen(false)}
                        >
                          My Orders
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-1">
                  <Link
                    to="/login"
                    className="text-base font-medium hover:underline"
                  >
                    Login
                  </Link>
                  <span>/</span>
                  <Link
                    to="/signup"
                    className="text-base font-medium hover:underline"
                  >
                    Signup
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 📱 ALWAYS VISIBLE MOBILE SEARCH BAR */}
        <div className="md:hidden w-full px-4 pb-3">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center bg-gray-100 rounded-md px-4 py-2"
          >
            <ion-icon
              name="search-outline"
              class="text-xl text-gray-500 mr-2"
            ></ion-icon>

            <input
              type="text"
              placeholder="Search Your Products"
              className="bg-transparent flex-1 outline-none text-base"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value.trim()) setSuggestions(recentSearches);
              }}
              onFocus={() => {
                if (searchQuery.trim()) setSuggestions(recentSearches);
              }}
            />

            <ion-icon
              name={listening ? "mic" : "mic-outline"}
              class={`text-xl ml-2 cursor-pointer transition-all ${
                listening ? "text-red-500 animate-pulse" : "text-gray-500"
              }`}
              onClick={handleVoiceSearch}
            ></ion-icon>
          </form>

          {suggestions.length > 0 && (
            <div className="bg-white shadow-md rounded-md mt-1 border border-gray-200 z-50">
              {suggestions.map((item, idx) => (
                <div
                  key={idx}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
                  onClick={() => {
                    setSearchQuery(item);
                    performSearch(item);
                    setSuggestions([]);
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 🧭 NAV LINKS (desktop + mobile responsive) */}
        <nav className="w-full bg-[#AFC2D5] shadow-sm">
          <div
            className={`max-w-7xl mx-auto flex-col md:flex-row md:flex gap-8 px-6 py-4 md:py-5 transition-all duration-300 ${
              mobileMenuOpen ? "flex" : "hidden md:flex"
            }`}
          >
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-base font-medium ${
                  isActive ? "underline" : "text-[#02066F] hover:underline"
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/products"
              className={({ isActive }) =>
                `text-base font-medium ${
                  isActive ? "underline" : "text-[#02066F] hover:underline"
                }`
              }
            >
              Products
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `text-base font-medium ${
                  isActive ? "underline" : "text-[#02066F] hover:underline"
                }`
              }
            >
              Contact Us
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `text-base font-medium ${
                  isActive ? "underline" : "text-[#02066F] hover:underline"
                }`
              }
            >
              About Us
            </NavLink>
            {/* ---- MOBILE MENU EXTRA OPTIONS ---- */}
            <div className="flex flex-col gap-4 mt-5 md:hidden">
              {/* ❤️ Wishlist */}
              <Link to="/wishlist" className="flex items-center gap-3">
                <ion-icon
                  name="heart-outline"
                  class="text-2xl text-[#02066F]"
                ></ion-icon>
                <span className="text-[#02066F] text-lg font-medium">
                  Wishlist
                </span>
                {wishlist.length > 0 && (
                  <span className="ml-auto bg-red-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* 🛒 Cart */}
              <Link to="/cart" className="flex items-center gap-3">
                <ion-icon
                  name="cart-outline"
                  class="text-2xl text-[#02066F]"
                ></ion-icon>
                <span className="text-[#02066F] text-lg font-medium">Cart</span>
                {totalItems > 0 && (
                  <span className="ml-auto bg-red-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* 👤 Login / Signup OR Profile */}
              {user ? (
                <div className="flex flex-col gap-3">
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 text-[#02066F] text-lg font-medium"
                  >
                    <ion-icon
                      name="person-circle-outline"
                      class="text-2xl"
                    ></ion-icon>
                    My Profile
                  </Link>

                  {user.role === "customer" && (
                    <Link
                      to="/my-orders"
                      className="flex items-center gap-3 text-[#02066F] text-lg font-medium"
                    >
                      <ion-icon name="bag-outline" class="text-2xl"></ion-icon>
                      My Orders
                    </Link>
                  )}

                  {(user.role === "admin" || user.role === "seller") && (
                    <Link
                      to={`/${user.role}`}
                      className="flex items-center gap-3 text-[#02066F] text-lg font-medium"
                    >
                      <ion-icon name="grid-outline" class="text-2xl"></ion-icon>
                      Manage Dashboard
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 text-red-600 text-lg font-medium mt-2"
                  >
                    <ion-icon
                      name="log-out-outline"
                      class="text-2xl"
                    ></ion-icon>
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 mt-2">
                  <Link
                    to="/login"
                    className="text-[#02066F] text-lg font-medium hover:underline"
                  >
                    Login
                  </Link>
                  <span>/</span>
                  <Link
                    to="/signup"
                    className="text-[#02066F] text-lg font-medium hover:underline"
                  >
                    Signup
                  </Link>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}
