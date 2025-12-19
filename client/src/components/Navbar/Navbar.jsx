import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiSearch,
  FiChevronDown,
  FiShoppingCart,
} from "react-icons/fi";
import { FaRegBuilding, FaHotel, FaArrowRight } from "react-icons/fa";
import { TbBrandBooking } from "react-icons/tb";
import { MdAdminPanelSettings, MdPerson } from "react-icons/md";
import { useClerk, useUser, UserButton } from "@clerk/clerk-react";
import { useAppContext } from "../../context/AppContext";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import { FiSun, FiMoon } from "react-icons/fi";

const Navbar = () => {
  const { isAdmin, setIsAdmin, axios, isDarkMode, toggleTheme } =
    useAppContext();
  const [userRole, setUserRole] = React.useState("user");
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(null);

  const { openSignIn } = useClerk();
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const [isDesktop, setIsDesktop] = React.useState(
    typeof window !== "undefined" ? window.innerWidth >= 768 : true,
  );

  React.useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Toggle body class when mobile menu opens/closes
  React.useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }

    return () => {
      document.body.classList.remove("menu-open");
    };
  }, [isMenuOpen]);

  const [isScrolled, setIsScrolled] = React.useState(false);

  const navLinks = [
    { name: "Beranda", path: "/", type: "link" },
    {
      name: "Tentang Kami",
      type: "dropdown",
      items: [
        { name: "Profil Bengkel", path: "/#about", icon: <FaRegBuilding /> },
        { name: "Layanan", path: "/#services", icon: <FaHotel /> },
        { name: "Galeri", path: "/#gallery", icon: <FaHotel /> },
      ],
    },
    { name: "Sparepart", path: "/spareparts", type: "link" },
    { name: "Services", path: "/services", type: "link" },
    { name: "Promo", path: "/#promos", type: "link" },
    { name: "Artikel", path: "/articles", type: "link" },
    { name: "Kontak", path: "/#contact", type: "link" },
  ];

  // Handler untuk switch mode
  const handleSwitchToAdmin = () => {
    setIsAdmin(true);
    navigate("/admin");
  };

  const handleSwitchToUser = () => {
    setIsAdmin(false);
    navigate("/");
  };

  // Check if the current path contains 'hotel'
  const isHotelPage = location.pathname.includes("hotel");
  const isBookingPage =
    location.pathname.includes("my-bookings") ||
    location.pathname.includes("cart");

  // Dynamic navbar styles based on URL - matching dark hero theme
  const navBg =
    isHotelPage || isBookingPage
      ? "bg-white shadow-md"
      : isScrolled
        ? "bg-gray-900/95 shadow-xl shadow-gray-900/50 backdrop-blur-sm border-b border-gray-800"
        : "bg-gray-900/30 backdrop-blur-md";
  const textColor =
    isHotelPage || isBookingPage
      ? "text-black"
      : isScrolled
        ? "text-white"
        : "text-white";
  const iconColor =
    isHotelPage || isBookingPage
      ? "text-black"
      : isScrolled
        ? "text-white"
        : "text-white";
  const borderColor = isScrolled ? "border-teal-500" : "border-teal-400";

  const handleDropdownToggle = (name) => {
    setDropdownOpen(dropdownOpen === name ? null : name);
  };

  const handleLinkClick = (path) => {
    console.log("🔔 handleLinkClick called with path:", path);
    setIsMenuOpen(false);
    setDropdownOpen(null);

    if (path.includes("#")) {
      const [basePath, hash] = path.split("#");

      // Helper: keep polling for the element until it appears, then scroll
      const scrollToHashWhenReady = (hashId) => {
        if (!hashId) return;
        const selector = `#${hashId}`;
        let attempts = 0;
        const maxAttempts = 40; // ~2s (40 * 50ms)
        const interval = setInterval(() => {
          attempts += 1;
          const element = document.querySelector(selector);
          if (element) {
            console.log("✅ Scrolling to element:", hashId);
            element.scrollIntoView({ behavior: "smooth" });
            clearInterval(interval);
          } else if (attempts >= maxAttempts) {
            console.log("⚠️ Element not found after waiting:", hashId);
            clearInterval(interval);
          }
        }, 50);
      };

      // Jika berada di halaman yang sama dengan basePath atau basePath kosong (berarti homepage)
      if (
        location.pathname === basePath ||
        (basePath === "/" && location.pathname === "/") ||
        basePath === ""
      ) {
        // Langsung scroll ke element
        console.log("✅ Same page, scrolling to:", hash);
        scrollToHashWhenReady(hash);
      } else {
        // Jika di halaman berbeda, navigate dulu lalu polling untuk element
        console.log(
          "🔄 Different page, navigating to:",
          basePath || "/",
          "then scrolling to:",
          hash,
        );
        navigate(basePath || "/");
        // Start polling immediately after navigate; when target mounts it will be found
        scrollToHashWhenReady(hash);
      }
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${navBg} ${isScrolled ? "shadow-lg" : "shadow-none"}`}
    >
      {/* Centered Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-4">
          {/* Logo - Left Aligned */}
          <div className="flex justify-start">
            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-3 group"
            >
              <div className="relative w-10 h-10 flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                <img
                  src="https://ik.imagekit.io/dzlzhxcdo/d-removebg-preview_sep4qr.svg?updatedAt=1763701230874"
                  alt="Aan Audio Solutions Logo"
                  className="w-full h-full object-contain relative z-10 transform group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <span
                className={`text-base sm:text-xl font-bold outfit ${textColor} group-hover:text-teal-600 transition-colors duration-300`}
              >
                <span className="hidden sm:inline">Aan Audio Solutions</span>
                <span className="sm:hidden">Aan Audio</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav - Perfectly Centered */}
          <div className="hidden lg:flex items-center justify-center gap-1 xl:gap-2">
            {navLinks.map((link, idx) => {
              if (link.type === "dropdown") {
                return (
                  <div
                    key={idx}
                    className="relative group z-50"
                    onMouseEnter={() => setDropdownOpen(link.name)}
                    onMouseLeave={() => setDropdownOpen(null)}
                  >
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      className={`relative flex items-center gap-1.5 px-3 lg:px-4 py-2 rounded-lg transition-all duration-300 font-medium text-xs lg:text-sm outfit whitespace-nowrap group ${
                        dropdownOpen === link.name
                          ? "text-teal-400 bg-gray-800/90 shadow-lg shadow-teal-500/30 scale-105"
                          : `${textColor} ${isHotelPage || isBookingPage ? "hover:text-teal-600 hover:bg-teal-50" : "hover:text-teal-400 hover:bg-gray-800/50"} hover:shadow-md hover:scale-105`
                      }`}
                    >
                      {dropdownOpen === link.name && (
                        <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-500/20 to-emerald-500/20 blur-sm"></span>
                      )}
                      <span className="relative z-10">{link.name}</span>
                      <FiChevronDown
                        className={`relative z-10 w-3.5 h-3.5 transition-all duration-300 ${
                          dropdownOpen === link.name
                            ? "rotate-180 text-teal-400"
                            : "group-hover:translate-y-0.5"
                        }`}
                      />
                    </button>

                    {/* Dropdown Menu */}
                    <div
                      onMouseEnter={() => setDropdownOpen(link.name)}
                      onMouseLeave={() => setDropdownOpen(null)}
                      className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 w-52 bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-teal-100/50 overflow-hidden transition-all duration-400 z-[100] ${
                        dropdownOpen === link.name
                          ? "opacity-100 visible translate-y-0 scale-100 pointer-events-auto"
                          : "opacity-0 invisible -translate-y-2 scale-95 pointer-events-none"
                      }`}
                    >
                      {dropdownOpen === link.name && (
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white/95 backdrop-blur-xl border-l border-t border-teal-100/50 rotate-45"></div>
                      )}
                      {link.items.map((item, itemIdx) => (
                        <button
                          key={itemIdx}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleLinkClick(item.path);
                            setDropdownOpen(null);
                          }}
                          className="relative flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-teal-50 hover:to-emerald-50 hover:text-teal-600 transition-all duration-300 outfit group border-b border-gray-50 last:border-0 overflow-hidden w-full text-left cursor-pointer"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-teal-500/0 via-teal-500/5 to-emerald-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                          <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-teal-100 to-emerald-100 flex items-center justify-center text-teal-600 text-sm group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-md group-hover:shadow-teal-200/50 group-hover:from-teal-600 group-hover:to-emerald-600 group-hover:text-white transition-all duration-300">
                            {item.icon}
                          </div>
                          <span className="relative font-medium group-hover:translate-x-0.5 transition-transform duration-300">
                            {item.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              }

              const isHashLink = link.path.includes("#");
              if (isHashLink) {
                return (
                  <a
                    key={idx}
                    href={link.path}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick(link.path);
                    }}
                    className={`relative ${textColor} transition-all duration-300 font-medium text-xs lg:text-sm outfit py-2 px-3 lg:px-4 rounded-lg hover:shadow-sm hover:scale-105 whitespace-nowrap group ${isHotelPage || isBookingPage ? "hover:text-teal-600 hover:bg-teal-50" : "hover:text-teal-400 hover:bg-gray-800/50"}`}
                  >
                    <span className="relative z-10">{link.name}</span>
                    <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-gradient-to-r from-teal-600 to-emerald-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                  </a>
                );
              }

              return (
                <Link
                  key={idx}
                  to={link.path}
                  onClick={() => {
                    if (link.path === "/") {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
                  className={`relative ${textColor} transition-all duration-300 font-medium text-xs lg:text-sm outfit py-2 px-3 lg:px-4 rounded-lg hover:shadow-sm hover:scale-105 whitespace-nowrap group ${isHotelPage || isBookingPage ? "hover:text-teal-600 hover:bg-teal-50" : "hover:text-teal-400 hover:bg-gray-800/50"}`}
                >
                  <span className="relative z-10">{link.name}</span>
                  <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-gradient-to-r from-teal-600 to-emerald-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </Link>
              );
            })}

            {user && userRole === "admin" && (
              <button
                onClick={() => navigate("/admin")}
                className={`relative border-2 px-3 lg:px-4 py-1.5 rounded-full text-xs cursor-pointer transition-all duration-300 whitespace-nowrap ${borderColor} ${textColor} hover:bg-gradient-to-r hover:from-teal-600 hover:to-emerald-600 hover:text-white hover:border-teal-500 hover:shadow-lg hover:shadow-teal-500/50 hover:scale-105 active:scale-100 font-semibold outfit overflow-hidden group`}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-emerald-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative z-10">Dashboard</span>
              </button>
            )}
          </div>

          {/* Desktop Right (only render when viewport >= md via JS) */}
          {isDesktop && (
            <div className="hidden lg:flex items-center justify-end gap-2 lg:gap-3">
              {user ? (
                <UserButton>
                  <UserButton.MenuItems>
                    <UserButton.Action
                      label="Keranjang Pesanan"
                      labelIcon={<FiShoppingCart />}
                      onClick={() => navigate("/cart")}
                    />
                    <UserButton.Action
                      label="Pesanan Saya"
                      labelIcon={<TbBrandBooking />}
                      onClick={() => navigate("/my-bookings")}
                    />
                    <UserButton.Action
                      label={isDarkMode ? "Mode Terang" : "Mode Gelap"}
                      labelIcon={isDarkMode ? <FiSun /> : <FiMoon />}
                      onClick={toggleTheme}
                    />
                    {userRole === "admin" && (
                      <UserButton.Action
                        label={
                          isAdmin
                            ? "Beralih ke Mode Pengguna"
                            : "Beralih ke Mode Admin"
                        }
                        labelIcon={
                          isAdmin ? <MdPerson /> : <MdAdminPanelSettings />
                        }
                        onClick={
                          isAdmin ? handleSwitchToUser : handleSwitchToAdmin
                        }
                      />
                    )}
                  </UserButton.MenuItems>
                </UserButton>
              ) : (
                <button
                  onClick={openSignIn}
                  className="relative bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-4 lg:px-6 py-2 rounded-full text-xs lg:text-sm hover:from-teal-700 hover:to-emerald-700 transition-all duration-300 cursor-pointer font-bold outfit shadow-lg shadow-teal-200/50 hover:shadow-xl hover:shadow-teal-300/60 hover:scale-105 active:scale-100 overflow-hidden group whitespace-nowrap"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                  <span className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                  <span className="relative z-10 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
                    Masuk
                  </span>
                </button>
              )}
            </div>
          )}

          {/* Mobile header: only search + menu button */}
          <div className="lg:hidden flex items-center gap-1">
            <button
              onClick={() => navigate("/cart")}
              className={`p-2 rounded-lg transition-all duration-300 ${isHotelPage || isBookingPage ? "text-gray-600 hover:bg-gray-100" : `${iconColor} hover:bg-white/10`}`}
              aria-label="Cart"
            >
              <FiShoppingCart className="h-5 w-5" />
            </button>
            <button
              className={`p-2 rounded-lg transition-all duration-300 ${isHotelPage || isBookingPage ? "text-gray-600 hover:bg-gray-100" : `${iconColor} hover:bg-white/10`}`}
              aria-label="Search"
            >
              <FiSearch className="h-5 w-5" />
            </button>
            <button
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open Menu"
              className={`p-2 rounded-lg transition-all duration-300 ${isHotelPage || isBookingPage ? "text-gray-600 hover:bg-gray-100" : `${iconColor} hover:bg-white/10`}`}
            >
              <FiMenu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Modern Design */}
      <div
        className={`fixed inset-0 w-screen h-screen flex flex-col transition-all duration-500 z-[9999] overscroll-contain ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background: isDarkMode
            ? "linear-gradient(135deg, #1f2937 0%, #111827 100%)"
            : "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
        }}
      >
        {/* Header dengan Glassmorphism */}
        <div
          className={`backdrop-blur-xl border-b px-4 sm:px-6 py-4 ${
            isDarkMode
              ? "bg-gray-800/50 border-gray-700/50"
              : "bg-white/50 border-gray-200/50"
          }`}
          style={{
            paddingTop: "max(env(safe-area-inset-top), 1rem)",
          }}
        >
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              onClick={() => {
                setIsMenuOpen(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="flex items-center gap-2 group"
            >
              <div className="relative w-9 h-9 sm:w-10 sm:h-10">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                <img
                  src="https://ik.imagekit.io/dzlzhxcdo/d-removebg-preview_sep4qr.svg?updatedAt=1763701230874"
                  alt="Aan Audio Solutions Logo"
                  className="w-full h-full object-contain relative z-10"
                />
              </div>
              <span
                className={`text-base sm:text-lg font-bold outfit tracking-tight transition-colors ${
                  isDarkMode
                    ? "text-white group-hover:text-teal-400"
                    : "text-gray-900 group-hover:text-teal-600"
                }`}
              >
                Aan Audio Solutions
              </span>
            </Link>

            {/* Action Buttons */}
            <div className="flex items-center gap-1">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  isDarkMode
                    ? "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
                aria-label="Toggle Theme"
              >
                {isDarkMode ? (
                  <FiSun className="h-5 w-5" />
                ) : (
                  <FiMoon className="h-5 w-5" />
                )}
              </button>

              {/* User Profile / Login */}
              {user ? (
                <div className="h-8 w-8 flex items-center justify-center">
                  <UserButton />
                </div>
              ) : (
                <button
                  onClick={openSignIn}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    isDarkMode
                      ? "bg-teal-600 text-white hover:bg-teal-700"
                      : "bg-gradient-to-r from-teal-600 to-emerald-600 text-white hover:shadow-lg"
                  }`}
                >
                  Masuk
                </button>
              )}

              {/* Close Button */}
              <button
                className={`p-2 rounded-lg transition-all duration-300 ml-1 ${
                  isDarkMode
                    ? "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close Menu"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Menu Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-4 sm:px-6 py-6">
          <div className="max-w-md mx-auto space-y-2">
            {navLinks.map((link, idx) => {
              if (link.type === "dropdown") {
                return (
                  <div key={idx} className="w-full">
                    <button
                      onClick={() => handleDropdownToggle(link.name)}
                      className={`flex items-center justify-between w-full px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                        dropdownOpen === link.name
                          ? isDarkMode
                            ? "bg-gradient-to-r from-teal-600/20 to-emerald-600/20 text-teal-400 shadow-lg"
                            : "bg-gradient-to-r from-teal-50 to-emerald-50 text-teal-600 shadow-md"
                          : isDarkMode
                            ? "bg-gray-800/50 text-gray-200 hover:bg-gray-700/50"
                            : "bg-white text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-base font-bold outfit">
                        {link.name}
                      </span>
                      <FiChevronDown
                        className={`w-5 h-5 transition-transform duration-300 ${
                          dropdownOpen === link.name ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {dropdownOpen === link.name && (
                      <div className="mt-2 mb-3 ml-3 space-y-1 animate-[fadeIn_0.2s_ease-out]">
                        {link.items.map((item, itemIdx) => (
                          <button
                            key={itemIdx}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleLinkClick(item.path);
                              setDropdownOpen(null);
                              setIsMenuOpen(false);
                            }}
                            className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all duration-300 group ${
                              isDarkMode
                                ? "bg-gray-800/30 text-gray-300 hover:bg-gray-700/50 hover:text-white"
                                : "bg-white text-gray-700 hover:bg-gradient-to-r hover:from-teal-50 hover:to-emerald-50 hover:text-teal-600"
                            }`}
                          >
                            <div
                              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 ${
                                isDarkMode
                                  ? "bg-teal-600/20 text-teal-400 group-hover:bg-teal-600/30"
                                  : "bg-gradient-to-br from-teal-100 to-emerald-100 text-teal-600 group-hover:from-teal-600 group-hover:to-emerald-600 group-hover:text-white group-hover:shadow-md"
                              }`}
                            >
                              {item.icon}
                            </div>
                            <span className="text-sm font-semibold">
                              {item.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              const isHashLink = link.path.includes("#");
              if (isHashLink) {
                return (
                  <a
                    key={idx}
                    href={link.path}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick(link.path);
                      setIsMenuOpen(false);
                    }}
                    className={`flex items-center justify-between w-full px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                      isDarkMode
                        ? "bg-gray-800/50 text-gray-200 hover:bg-gray-700/50 hover:text-white"
                        : "bg-white text-gray-900 hover:bg-gray-50 hover:text-teal-600"
                    }`}
                  >
                    <span className="text-base font-bold outfit">
                      {link.name}
                    </span>
                    <FaArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </a>
                );
              }

              return (
                <Link
                  key={idx}
                  to={link.path}
                  onClick={() => {
                    setIsMenuOpen(false);
                    if (link.path === "/") {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
                  className={`flex items-center justify-between w-full px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                    isDarkMode
                      ? "bg-gray-800/50 text-gray-200 hover:bg-gray-700/50 hover:text-white"
                      : "bg-white text-gray-900 hover:bg-gray-50 hover:text-teal-600"
                  }`}
                >
                  <span className="text-base font-bold outfit">
                    {link.name}
                  </span>
                  <FaArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom Section */}
        <div
          className={`backdrop-blur-xl border-t px-4 sm:px-6 py-5 ${
            isDarkMode
              ? "bg-gray-800/50 border-gray-700/50"
              : "bg-white/50 border-gray-200/50"
          }`}
          style={{
            paddingBottom: "max(env(safe-area-inset-bottom), 1.25rem)",
          }}
        >
          <div className="max-w-md mx-auto space-y-3">
            {/* Admin Dashboard Button */}
            {user && userRole === "admin" && (
              <button
                onClick={() => {
                  navigate("/admin");
                  setIsMenuOpen(false);
                }}
                className={`w-full px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                  isDarkMode
                    ? "bg-teal-600 text-white hover:bg-teal-700 shadow-lg"
                    : "bg-gradient-to-r from-teal-600 to-emerald-600 text-white hover:shadow-xl"
                }`}
              >
                🎛️ Dashboard Admin
              </button>
            )}

            {/* Quick Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => navigate("/cart")}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  isDarkMode
                    ? "bg-gray-700/50 text-gray-200 hover:bg-gray-600/50"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <FiShoppingCart className="w-4 h-4" />
                <span>Keranjang</span>
              </button>
              <button
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  isDarkMode
                    ? "bg-gray-700/50 text-gray-200 hover:bg-gray-600/50"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <FiSearch className="w-4 h-4" />
                <span>Cari</span>
              </button>
            </div>

            {/* Footer Text */}
            <p
              className={`text-center text-xs ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              © 2024 Aan Audio Solutions
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
