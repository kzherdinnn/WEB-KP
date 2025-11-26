import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaSearch,
  FaUsers,
  FaArrowDown,
} from "react-icons/fa";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const cities = ["Delhi", "Mumbai", "Chennai", "Banglore"];

// Typing Animation Hook
const useTypingEffect = (
  texts,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseDuration = 2000,
) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[currentIndex];

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          // Typing
          if (displayText.length < currentText.length) {
            setDisplayText(currentText.slice(0, displayText.length + 1));
          } else {
            // Pause before deleting
            setTimeout(() => setIsDeleting(true), pauseDuration);
          }
        } else {
          // Deleting
          if (displayText.length > 0) {
            setDisplayText(currentText.slice(0, displayText.length - 1));
          } else {
            setIsDeleting(false);
            setCurrentIndex((prev) => (prev + 1) % texts.length);
          }
        }
      },
      isDeleting ? deletingSpeed : typingSpeed,
    );

    return () => clearTimeout(timeout);
  }, [
    displayText,
    isDeleting,
    currentIndex,
    texts,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
  ]);

  return displayText;
};

// Counter Animation Hook
const useCounter = (end, duration = 2000, delay = 0) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!hasStarted) return;

    const timer = setTimeout(() => {
      let startTime;
      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);

        setCount(Math.floor(progress * end));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }, delay);

    return () => clearTimeout(timer);
  }, [end, duration, delay, hasStarted]);

  return [count, setHasStarted];
};

const Hero = () => {
  const { navigate } = useAppContext();
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  // Get theme from context
  const { isDarkMode } = useAppContext();

  // Typing animation texts
  const typingTexts = [
    "Audio mobil, alarm, dan GPS berkualitas",
    "Pemasangan profesional untuk kendaraan Anda",
  ];
  const typingText = useTypingEffect(typingTexts, 50, 30, 800);

  // Counter animations
  const [hotelsCount, startHotelsCounter] = useCounter(500, 2000);
  const [guestsCount, startGuestsCounter] = useCounter(10000, 2000, 200);
  const [ratingCount, startRatingCounter] = useCounter(49, 2000, 400);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!destination) {
        toast.error("Please select a destination");
        return;
      }
      navigate(`/hotels/?destination=${destination}`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden pt-16 md:pt-0">
      {/* Dynamic Gradient Background based on theme */}
      <div
        className={`absolute inset-0 transition-colors duration-500 ${
          isDarkMode
            ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
            : "bg-gradient-to-br from-white via-gray-50 to-teal-50"
        }`}
      ></div>

      {/* Animated Decorative Shapes */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={`absolute top-0 left-0 w-96 h-96 rounded-full filter blur-3xl ${
          isDarkMode ? "bg-teal-500/10" : "bg-teal-500/20"
        }`}
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -30, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className={`absolute top-0 right-0 w-96 h-96 rounded-full filter blur-3xl ${
          isDarkMode ? "bg-emerald-500/10" : "bg-emerald-500/20"
        }`}
      />
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          x: [0, -20, 0],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
        }}
        className={`absolute bottom-0 left-1/2 w-96 h-96 rounded-full filter blur-3xl ${
          isDarkMode ? "bg-teal-500/10" : "bg-teal-500/20"
        }`}
      />

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-16 py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center min-h-[calc(100vh-200px)] sm:min-h-[calc(100vh-160px)]">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4 sm:space-y-6 md:space-y-8"
          >
            {/* Main Title with Stagger Animation */}
            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-1 sm:mb-2"
              >
                <motion.div
                  className="relative"
                  animate={{
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full blur-lg opacity-50"
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <img
                    src="https://ik.imagekit.io/dzlzhxcdo/d-removebg-preview_sep4qr.svg"
                    className="h-10 sm:h-12 md:h-16 lg:h-20 relative z-10"
                  />
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight outfit relative"
                >
                  {"Aan Audio".split("").map((letter, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{
                        opacity: 1,
                        y: [0, -10, 0],
                      }}
                      transition={{
                        opacity: { duration: 0.3, delay: 0.5 + index * 0.1 },
                        y: {
                          duration: 2,
                          repeat: Infinity,
                          delay: index * 0.2,
                          ease: "easeInOut",
                        },
                      }}
                      className="inline-block bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent"
                      style={{
                        textShadow: "0 0 30px rgba(45, 212, 191, 0.5)",
                      }}
                    >
                      {letter}
                    </motion.span>
                  ))}
                </motion.h1>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className={`text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-medium outfit flex items-center gap-2 ${
                  isDarkMode ? "text-white/90" : "text-gray-800"
                }`}
              >
                {typingText}
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="inline-block w-0.5 h-6 sm:h-7 md:h-8 lg:h-10 bg-teal-400"
                />
              </motion.h2>
            </div>

            {/* Description with Fade In */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className={`text-sm sm:text-base md:text-lg lg:text-xl max-w-xl leading-relaxed outfit font-light ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Temukan kualitas terbaik untuk audio mobil pilihan Anda. Nikmati produk unggulan dengan teknologi modern untuk pengalaman berkendara yang lebih nyaman dan aman.
            </motion.p>

            {/* CTA Button with Advanced Animation */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                document
                  .getElementById("search-form")
                  .scrollIntoView({ behavior: "smooth" })
              }
              className="relative inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-full font-bold text-sm sm:text-base md:text-lg shadow-xl shadow-teal-500/50 hover:shadow-2xl hover:shadow-teal-500/60 transition-all duration-300 outfit group overflow-hidden"
            >
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.5 }}
              />
              <span className="relative z-10">Tentang kami</span>
              <motion.span
                animate={{ y: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <FaArrowDown className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" />
              </motion.span>
            </motion.button>

            {/* Stats with Counter Animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              onViewportEnter={() => {
                startHotelsCounter(true);
                startGuestsCounter(true);
                startRatingCounter(true);
              }}
              className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 pt-4 sm:pt-6 md:pt-8"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.3 }}
                whileHover={{ scale: 1.1 }}
              >
                <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent outfit">
                  {hotelsCount}+
                </p>
                <p
                  className={`text-xs sm:text-sm mt-1 outfit ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  Hotels
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.5 }}
                whileHover={{ scale: 1.1 }}
              >
                <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent outfit">
                  {(guestsCount / 1000).toFixed(0)}k+
                </p>
                <p
                  className={`text-xs sm:text-sm mt-1 outfit ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  Happy Guests
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.7 }}
                whileHover={{ scale: 1.1 }}
              >
                <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent outfit">
                  {(ratingCount / 10).toFixed(1)}★
                </p>
                <p
                  className={`text-xs sm:text-sm mt-1 outfit ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  Rating
                </p>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Image - Showcase with Parallax */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            {/* Floating Animation Wrapper */}
            <motion.div
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="relative">
                {/* Main Image Container with Rounded Effect */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="relative rounded-[3rem] overflow-hidden shadow-2xl"
                >
                  {/* Shimmer Effect Overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent z-10"
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatDelay: 2,
                      ease: "easeInOut",
                    }}
                  />
                  <img
                    src="https://ik.imagekit.io/dzlzhxcdo/WhatsApp_Image_2025-11-12_at_13.48.51_dd74069b_d3gxbj.jpg?updatedAt=1763701230685"
                    alt=""
                    className="w-full h-[600px] object-cover"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                </motion.div>

                {/* Floating Badge with Animation */}
                <motion.div
                  initial={{ opacity: 0, x: -50, y: 50 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.5 }}
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-2xl p-6"
                >
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.7 }}
                    className="text-sm text-gray-600 outfit mb-1"
                  >
                    Trusted by
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 1.9 }}
                    className="text-2xl font-bold text-teal-700 outfit"
                  >
                    5000+ Users
                  </motion.p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Down Indicator with Animation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 2 }}
        className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 hidden md:flex"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className={`flex flex-col items-center gap-2 cursor-pointer hover:text-teal-400 transition-colors ${
            isDarkMode ? "text-white/80" : "text-gray-600"
          }`}
          onClick={() =>
            document
              .getElementById("search-form")
              .scrollIntoView({ behavior: "smooth" })
          }
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 2.2 }}
            className="text-xs sm:text-sm outfit"
          >
            Scroll untuk booking
          </motion.p>
          <motion.div
            animate={{
              y: [0, 5, 0],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <FaArrowDown className="w-3 h-3 sm:w-4 sm:h-4" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Search Form Section - Below Fold */}
      <div
        id="search-form"
        className={`relative py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8 lg:px-16 transition-colors duration-500 ${
          isDarkMode ? "bg-gray-900" : "bg-white"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-6 sm:mb-8 md:mb-12"
          >
            <h2
              className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 md:mb-4 outfit ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Find Your Perfect Stay
            </h2>
            <p
              className={`outfit text-sm sm:text-base md:text-lg ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Search and book the best hotels for your next adventure
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            onSubmit={onSubmit}
            className={`rounded-2xl sm:rounded-3xl shadow-xl border p-4 sm:p-6 md:p-8 transition-colors duration-500 ${
              isDarkMode
                ? "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700"
                : "bg-gradient-to-br from-teal-50 to-emerald-50 border-teal-100"
            }`}
          >
            {/* Form Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 mb-4 sm:mb-5 md:mb-6">
              {/* Destination Input */}
              <div className="space-y-2 sm:space-y-3">
                <label
                  htmlFor="destinationInput"
                  className={`flex items-center gap-2 sm:gap-3 font-semibold outfit text-xs sm:text-sm md:text-base ${
                    isDarkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  <div
                    className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isDarkMode ? "bg-teal-900/50" : "bg-teal-100"
                    }`}
                  >
                    <FaMapMarkerAlt
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${
                        isDarkMode ? "text-teal-400" : "text-teal-600"
                      }`}
                    />
                  </div>
                  <span>Destination</span>
                </label>
                <input
                  list="destinations"
                  id="destinationInput"
                  name="destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  type="text"
                  className={`w-full rounded-lg sm:rounded-xl border-2 px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm md:text-base outline-none focus:ring-2 transition-all duration-300 outfit ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-600 text-white focus:border-teal-500 focus:ring-teal-500/30 placeholder:text-gray-500"
                      : "bg-white border-teal-200 text-gray-900 focus:border-teal-500 focus:ring-teal-200 placeholder:text-gray-400"
                  }`}
                  placeholder="Where to?"
                  required
                />
                <datalist id="destinations">
                  {cities.map((city, index) => (
                    <option value={city} key={index} />
                  ))}
                </datalist>
              </div>

              {/* Check-in Date */}
              <div className="space-y-2 sm:space-y-3">
                <label
                  htmlFor="checkIn"
                  className={`flex items-center gap-2 sm:gap-3 font-semibold outfit text-xs sm:text-sm md:text-base ${
                    isDarkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  <div
                    className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isDarkMode ? "bg-emerald-900/50" : "bg-emerald-100"
                    }`}
                  >
                    <FaCalendarAlt
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${
                        isDarkMode ? "text-emerald-400" : "text-emerald-600"
                      }`}
                    />
                  </div>
                  <span>Check in</span>
                </label>
                <input
                  id="checkIn"
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className={`w-full rounded-lg sm:rounded-xl border-2 px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm md:text-base outline-none focus:ring-2 transition-all duration-300 outfit ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-600 text-white focus:border-emerald-500 focus:ring-emerald-500/30"
                      : "bg-white border-teal-200 text-gray-900 focus:border-emerald-500 focus:ring-emerald-200"
                  }`}
                />
              </div>

              {/* Check-out Date */}
              <div className="space-y-2 sm:space-y-3">
                <label
                  htmlFor="checkOut"
                  className={`flex items-center gap-2 sm:gap-3 font-semibold outfit text-xs sm:text-sm md:text-base ${
                    isDarkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  <div
                    className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isDarkMode ? "bg-yellow-900/50" : "bg-yellow-100"
                    }`}
                  >
                    <FaCalendarAlt
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${
                        isDarkMode ? "text-yellow-400" : "text-yellow-600"
                      }`}
                    />
                  </div>
                  <span>Check out</span>
                </label>
                <input
                  id="checkOut"
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className={`w-full rounded-lg sm:rounded-xl border-2 px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm md:text-base outline-none focus:ring-2 transition-all duration-300 outfit ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-600 text-white focus:border-yellow-500 focus:ring-yellow-500/30"
                      : "bg-white border-teal-200 text-gray-900 focus:border-yellow-500 focus:ring-yellow-200"
                  }`}
                />
              </div>

              {/* Guests Input */}
              <div className="space-y-2 sm:space-y-3">
                <label
                  htmlFor="guests"
                  className={`flex items-center gap-2 sm:gap-3 font-semibold outfit text-xs sm:text-sm md:text-base ${
                    isDarkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  <div
                    className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isDarkMode ? "bg-teal-900/50" : "bg-teal-100"
                    }`}
                  >
                    <FaUsers
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${
                        isDarkMode ? "text-teal-400" : "text-teal-600"
                      }`}
                    />
                  </div>
                  <span>Guests</span>
                </label>
                <input
                  min={1}
                  max={10}
                  id="guests"
                  type="number"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className={`w-full rounded-lg sm:rounded-xl border-2 px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm md:text-base outline-none focus:ring-2 transition-all duration-300 outfit ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-600 text-white focus:border-teal-500 focus:ring-teal-500/30 placeholder:text-gray-500"
                      : "bg-white border-teal-200 text-gray-900 focus:border-teal-500 focus:ring-teal-200 placeholder:text-gray-400"
                  }`}
                  placeholder="1"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="relative w-full flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 py-4 px-6 text-white font-semibold text-base md:text-lg outfit hover:from-teal-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] transform cursor-pointer group overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <FaSearch className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span>Search Hotels</span>
              </button>
            </div>

            {/* Popular Destinations */}
            <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-teal-200">
              <span className="text-gray-600 text-sm outfit font-medium">
                Popular:
              </span>
              {cities.slice(0, 4).map((city, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setDestination(city)}
                  className="px-4 py-2 bg-white text-teal-700 text-sm rounded-full hover:bg-teal-50 transition-all duration-300 border border-teal-200 outfit font-medium shadow-sm hover:shadow"
                >
                  {city}
                </button>
              ))}
            </div>
          </motion.form>
        </div>
      </div>

      {/* CSS for animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      ` }} />
    </div>
  );
};

export default Hero;
