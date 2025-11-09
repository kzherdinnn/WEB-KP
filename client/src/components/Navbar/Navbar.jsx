import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiMenu, FiX, FiSearch, FiChevronDown } from "react-icons/fi";
import { FaRegBuilding, FaHotel } from "react-icons/fa";
import { TbBrandBooking } from "react-icons/tb";
import { MdAdminPanelSettings, MdPerson } from "react-icons/md";
import { useClerk, useUser, UserButton } from "@clerk/clerk-react";
import { useAppContext } from "../../context/AppContext";
import ThemeToggle from "../ThemeToggle/ThemeToggle";

const Navbar = () => {
  const { isAdmin, setIsAdmin, axios } = useAppContext();
  const [userRole, setUserRole] = React.useState("user");
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(null);

  const { openSignIn } = useClerk();
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch user role dari backend
  React.useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        try {
          const { data } = await axios.get("/api/user");
          if (data.success) {
            setUserRole(data.role);
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      }
    };
    fetchUserRole();
  }, [user, axios]);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [isScrolled, setIsScrolled] = React.useState(false);

  // Navigation Menu Structure with Grouping
  const navLinks = [
    { name: "Beranda", path: "/", type: "link" },
    {
      name: "Tentang Kami",
      type: "dropdown",
      items: [
        { name: "Profil Hotel", path: "/#about", icon: <FaRegBuilding /> },
        { name: "Fasilitas", path: "/#facilities", icon: <FaHotel /> },
        { name: "Galeri", path: "/#gallery", icon: <FaHotel /> },
      ],
    },
    { name: "Kamar & Harga", path: "/hotels", type: "link" },
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
  const isBookingPage = location.pathname.includes("my-bookings");

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

      // Jika berada di halaman yang sama dengan basePath atau basePath kosong (berarti homepage)
      if (
        location.pathname === basePath ||
        (basePath === "/" && location.pathname === "/") ||
        basePath === ""
      ) {
        // Langsung scroll ke element
        console.log("✅ Same page, scrolling to:", hash);
        const element = document.querySelector(hash ? `#${hash}` : "");
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        } else {
          console.log("❌ Element not found:", hash);
        }
      } else {
        // Jika di halaman berbeda, navigate dulu baru scroll
        console.log(
          "🔄 Different page, navigating to:",
          basePath || "/",
          "then scrolling to:",
          hash,
        );
        navigate(basePath || "/");
        // Tunggu sebentar agar halaman ter-render, baru scroll
        setTimeout(() => {
          const element = document.querySelector(hash ? `#${hash}` : "");
          if (element) {
            console.log("✅ Scrolling to element:", hash);
            element.scrollIntoView({ behavior: "smooth" });
          } else {
            console.log("❌ Element not found after navigation:", hash);
          }
        }, 100);
      }
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${navBg} ${isScrolled ? "shadow-lg" : "shadow-none"}`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12">
        <div className="flex items-center justify-between py-2 md:py-3">
          {/* Logo */}
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-3 group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
              <img
                src="/favicon.svg"
                alt="logo"
                className="h-8 md:h-9 relative z-10 transform group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <span
              className={`text-xl md:text-2xl font-bold outfit ${textColor} group-hover:text-teal-600 transition-colors duration-300`}
            >
              StayZa
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            {navLinks.map((link, idx) => {
              if (link.type === "dropdown") {
                return (
                  <div
                    key={idx}
                    className="relative group z-50"
                    onMouseEnter={() => setDropdownOpen(link.name)}
                    onMouseLeave={() => {
                      setTimeout(() => setDropdownOpen(null), 150);
                    }}
                  >
                    <button
                      className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all duration-300 font-medium text-sm outfit group ${
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
                      className={`absolute top-full left-0 mt-3 w-52 bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-teal-100/50 overflow-hidden transition-all duration-400 z-[100] ${
                        dropdownOpen === link.name
                          ? "opacity-100 visible translate-y-0 scale-100 pointer-events-auto"
                          : "opacity-0 invisible -translate-y-2 scale-95 pointer-events-none"
                      }`}
                    >
                      {dropdownOpen === link.name && (
                        <div className="absolute -top-1 left-8 w-2.5 h-2.5 bg-white/95 backdrop-blur-xl border-l border-t border-teal-100/50 rotate-45"></div>
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
                    onClick={() => handleLinkClick(link.path)}
                    className={`relative ${textColor} transition-all duration-300 font-medium text-sm outfit py-2 px-3 rounded-lg hover:shadow-sm hover:scale-105 group ${isHotelPage || isBookingPage ? "hover:text-teal-600 hover:bg-teal-50" : "hover:text-teal-400 hover:bg-gray-800/50"}`}
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
                  className={`relative ${textColor} transition-all duration-300 font-medium text-sm outfit py-2 px-3 rounded-lg hover:shadow-sm hover:scale-105 group ${isHotelPage || isBookingPage ? "hover:text-teal-600 hover:bg-teal-50" : "hover:text-teal-400 hover:bg-gray-800/50"}`}
                >
                  <span className="relative z-10">{link.name}</span>
                  <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-gradient-to-r from-teal-600 to-emerald-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </Link>
              );
            })}

            {user && userRole === "admin" && (
              <button
                onClick={() => navigate("/admin")}
                className={`relative border-2 px-4 py-1.5 rounded-full text-xs cursor-pointer transition-all duration-300 ${borderColor} ${textColor} hover:bg-gradient-to-r hover:from-teal-600 hover:to-emerald-600 hover:text-white hover:border-teal-500 hover:shadow-lg hover:shadow-teal-500/50 hover:scale-105 active:scale-100 font-semibold outfit overflow-hidden group`}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-emerald-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative z-10">Dashboard</span>
              </button>
            )}
          </div>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle */}
            <ThemeToggle />

            <button
              className={`relative p-2 ${iconColor} transition-all duration-300 rounded-lg hover:shadow-md hover:scale-110 active:scale-100 group overflow-hidden ${isHotelPage || isBookingPage ? "hover:text-teal-600 hover:bg-gradient-to-br hover:from-teal-50 hover:to-emerald-50 hover:shadow-teal-100/50" : "hover:text-teal-400 hover:bg-gray-800/50 hover:shadow-teal-500/30"}`}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-teal-500/0 via-teal-500/20 to-emerald-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></span>
              <FiSearch className="relative z-10 h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
            </button>
            {user ? (
              <UserButton>
                <UserButton.MenuItems>
                  <UserButton.Action
                    label="My Bookings"
                    labelIcon={<TbBrandBooking />}
                    onClick={() => navigate("/my-bookings")}
                  />
                  {userRole === "admin" && (
                    <UserButton.Action
                      label={
                        isAdmin ? "Switch to User Mode" : "Switch to Admin Mode"
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
                className="relative bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-6 py-2 rounded-full text-sm hover:from-teal-700 hover:to-emerald-700 transition-all duration-300 cursor-pointer font-bold outfit shadow-lg shadow-teal-200/50 hover:shadow-xl hover:shadow-teal-300/60 hover:scale-105 active:scale-100 overflow-hidden group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                <span className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                <span className="relative z-10 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
                  Login
                </span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {/* Theme Toggle for Mobile */}
            <ThemeToggle />

            {user && (
              <UserButton>
                <UserButton.MenuItems>
                  <UserButton.Action
                    label="My Bookings"
                    labelIcon={<TbBrandBooking />}
                    onClick={() => navigate("/my-bookings")}
                  />
                  {userRole === "admin" && (
                    <UserButton.Action
                      label={
                        isAdmin ? "Switch to User Mode" : "Switch to Admin Mode"
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
            )}
            <button
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open Menu"
              className="p-1.5 hover:bg-white/20 rounded-lg transition-all duration-300"
            >
              <FiMenu className={`h-5 w-5 ${iconColor}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 w-full h-screen text-gray-800 flex flex-col gap-3 py-20 px-8 transition-transform duration-500 z-50 bg-gradient-to-b from-white via-teal-50/30 to-white overflow-y-auto
        ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <button
          className="absolute top-6 right-6 text-white bg-gradient-to-r from-teal-600 to-emerald-600 p-2 rounded-full hover:from-teal-700 hover:to-emerald-700 transition-all duration-300 shadow-lg"
          onClick={() => setIsMenuOpen(false)}
          aria-label="Close Menu"
        >
          <FiX className="h-6 w-6" />
        </button>

        {/* Mobile Logo */}
        <div className="mb-8">
          <Link
            to="/"
            onClick={() => {
              setIsMenuOpen(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-3"
          >
            <img src="/favicon.svg" alt="logo" className="h-12" />
            <span className="text-3xl font-bold outfit bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
              StayZa
            </span>
          </Link>
        </div>

        {navLinks.map((link, idx) => {
          if (link.type === "dropdown") {
            return (
              <div
                key={idx}
                className={`rounded-xl p-4 shadow-md mb-2.5 transition-all duration-400 overflow-hidden ${
                  dropdownOpen === link.name
                    ? "bg-gradient-to-br from-teal-50 via-emerald-50 to-teal-50 shadow-lg shadow-teal-100/50"
                    : "bg-white/90 backdrop-blur-sm"
                }`}
              >
                <button
                  onClick={() => handleDropdownToggle(link.name)}
                  className={`flex items-center justify-between w-full text-base font-bold transition-all duration-300 outfit group ${
                    dropdownOpen === link.name
                      ? "text-teal-600"
                      : "text-gray-800 hover:text-teal-600"
                  }`}
                >
                  <span className="relative">
                    {link.name}
                    {dropdownOpen === link.name && (
                      <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-600 to-emerald-600"></span>
                    )}
                  </span>
                  <div
                    className={`p-1.5 rounded-lg transition-all duration-300 ${dropdownOpen === link.name ? "bg-teal-100 rotate-180" : "group-hover:bg-teal-50"}`}
                  >
                    <FiChevronDown
                      className={`w-4 h-4 transition-all duration-300 ${
                        dropdownOpen === link.name
                          ? "text-teal-600"
                          : "group-hover:translate-y-0.5"
                      }`}
                    />
                  </div>
                </button>

                {dropdownOpen === link.name && (
                  <div className="mt-3 space-y-1.5 bg-white/60 backdrop-blur-sm rounded-lg p-2 animate-[fadeIn_0.3s_ease-out]">
                    {link.items.map((item, itemIdx) => (
                      <button
                        key={itemIdx}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleLinkClick(item.path);
                          setDropdownOpen(null);
                        }}
                        className="relative flex items-center gap-3 text-sm text-gray-700 hover:text-teal-600 transition-all duration-300 py-2.5 px-3 hover:bg-white rounded-lg outfit font-medium group overflow-hidden w-full text-left cursor-pointer"
                        style={{ animationDelay: `${itemIdx * 50}ms` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/0 via-teal-500/5 to-emerald-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                        <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-teal-100 to-emerald-100 flex items-center justify-center text-teal-600 text-sm group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-md group-hover:shadow-teal-200/50 transition-all duration-300">
                          {item.icon}
                        </div>
                        <span className="relative group-hover:translate-x-0.5 transition-transform duration-300">
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
                onClick={() => handleLinkClick(link.path)}
                className="relative text-lg font-bold hover:text-teal-600 hover:bg-gradient-to-r hover:from-teal-50 hover:to-emerald-50 transition-all duration-300 bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg hover:shadow-xl hover:shadow-teal-100/50 mb-3 block outfit group overflow-hidden hover:scale-[1.02]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/0 via-teal-500/10 to-emerald-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <span className="relative">{link.name}</span>
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
              className="relative text-lg font-bold hover:text-teal-600 hover:bg-gradient-to-r hover:from-teal-50 hover:to-emerald-50 transition-all duration-300 bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg hover:shadow-xl hover:shadow-teal-100/50 mb-3 block outfit group overflow-hidden hover:scale-[1.02]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/0 via-teal-500/10 to-emerald-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <span className="relative">{link.name}</span>
            </Link>
          );
        })}

        {user && userRole === "admin" && (
          <button
            onClick={() => {
              navigate("/admin");
              setIsMenuOpen(false);
            }}
            className="relative mt-6 w-full border-2 border-teal-600 text-teal-600 px-6 py-4 rounded-2xl font-bold hover:bg-gradient-to-r hover:from-teal-600 hover:to-emerald-600 hover:text-white hover:border-emerald-600 transition-all duration-300 hover:scale-105 active:scale-100 outfit shadow-lg hover:shadow-xl hover:shadow-teal-200/50 overflow-hidden group"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
            <span className="relative z-10">Dashboard</span>
          </button>
        )}

        {!user && (
          <button
            onClick={openSignIn}
            className="relative mt-6 w-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-8 py-5 rounded-2xl hover:from-teal-700 hover:to-emerald-700 transition-all duration-300 hover:scale-105 active:scale-100 font-bold outfit shadow-xl shadow-teal-200/50 hover:shadow-2xl hover:shadow-teal-300/60 text-lg overflow-hidden group"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
            <span className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
            <span className="relative z-10 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
              Login
            </span>
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
