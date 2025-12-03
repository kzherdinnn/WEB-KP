import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaWrench,
  FaCar,
  FaSearch,
  FaStar,
  FaArrowRight,
  FaTools,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";

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
  const { isDarkMode } = useAppContext();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Typing animation texts
  const typingTexts = [
    "Spesialis Audio Mobil Premium",
    "Pemasangan Alarm & GPS Tracker",
    "Kaca Film Berkualitas Tinggi",
    "Perdam Suara & Karpet Mobil",
  ];
  const typingText = useTypingEffect(typingTexts, 60, 30, 2000);

  // Counter animations
  const [installCount, startInstallCounter] = useCounter(1500, 2000);
  const [satisfiedCount, startSatisfiedCounter] = useCounter(1200, 2000, 200);
  const [yearsCount, startYearsCounter] = useCounter(15, 2000, 400);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1], // Cubic bezier for smooth "Apple-like" easing
      },
    },
  };

  return (
    <div className="relative h-screen overflow-hidden pt-16 md:pt-20 pb-4 md:pb-8 flex items-center">
      {/* Dynamic Gradient Background */}
      <div
        className={`absolute inset-0 transition-colors duration-500 ${isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-white via-gray-50 to-teal-50"
          }`}
      ></div>

      {/* Background Shapes with Parallax */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            rotate: 360,
            x: mousePosition.x * -20,
            y: mousePosition.y * -20,
          }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            x: { type: "spring", stiffness: 50, damping: 20 },
            y: { type: "spring", stiffness: 50, damping: 20 },
          }}
          className={`absolute -top-1/2 -right-1/2 w-[1000px] h-[1000px] rounded-full opacity-20 blur-3xl ${isDarkMode ? "bg-teal-900" : "bg-teal-100"
            }`}
        />
        <motion.div
          animate={{
            rotate: -360,
            x: mousePosition.x * 20,
            y: mousePosition.y * 20,
          }}
          transition={{
            rotate: { duration: 25, repeat: Infinity, ease: "linear" },
            x: { type: "spring", stiffness: 50, damping: 20 },
            y: { type: "spring", stiffness: 50, damping: 20 },
          }}
          className={`absolute -bottom-1/2 -left-1/2 w-[800px] h-[800px] rounded-full opacity-20 blur-3xl ${isDarkMode ? "bg-emerald-900" : "bg-emerald-100"
            }`}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4 md:space-y-6"
          >
            <motion.div variants={itemVariants} className="space-y-2 md:space-y-3">
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-teal-100/80 backdrop-blur-sm text-teal-800 font-medium text-xs md:text-sm border border-teal-200"
              >
                <FaStar className="text-yellow-500 animate-spin-slow" />
                <span>Bengkel Variasi Mobil Terpercaya</span>
              </div>

              <h1 className={`text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-none font-outfit ${isDarkMode ? "text-white" : "text-gray-900"
                }`}>
                Tingkatkan Kenyamanan <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-500">
                  Berkendara Anda
                </span>
              </h1>

              <div className={`h-8 md:h-12 text-lg md:text-xl lg:text-2xl font-medium font-outfit flex items-center ${isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}>
                <span className="mr-2">Ahli dalam</span>
                <span className="text-teal-600 font-bold">
                  {typingText}
                </span>
                <span className="animate-pulse ml-1 text-teal-500">|</span>
              </div>

              <p className={`text-base md:text-lg max-w-xl leading-relaxed ${isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}>
                Kami menyediakan layanan pemasangan audio, aksesoris, dan perawatan mobil dengan teknisi berpengalaman dan produk berkualitas original.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2">
              <Link
                to="/booking"
                className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl font-bold text-base md:text-lg overflow-hidden transition-all shadow-lg hover:shadow-teal-500/30 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center gap-2">
                  <FaTools className="group-hover:rotate-12 transition-transform" />
                  Booking Service
                </span>
              </Link>
              <Link
                to="/spareparts"
                className={`group inline-flex items-center justify-center gap-2 px-6 py-3 md:px-8 md:py-4 rounded-xl font-bold text-base md:text-lg border-2 transition-all hover:-translate-y-1 ${isDarkMode
                  ? "border-gray-600 text-white hover:bg-gray-800 hover:border-gray-500"
                  : "border-gray-200 text-gray-700 hover:bg-white hover:border-teal-200 hover:shadow-lg hover:shadow-teal-100"
                  }`}
              >
                <FaSearch className="group-hover:scale-110 transition-transform" />
                Cari Sparepart
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={itemVariants}
              onViewportEnter={() => {
                startInstallCounter(true);
                startSatisfiedCounter(true);
                startYearsCounter(true);
              }}
              className="grid grid-cols-3 gap-4 md:gap-6 pt-4 md:pt-8 border-t border-gray-200/50"
            >
              <div className="group cursor-default">
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-teal-600 group-hover:scale-110 transition-transform origin-left duration-300">{installCount}+</h3>
                <p className={`text-xs md:text-sm mt-1 font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Project Selesai</p>
              </div>
              <div className="group cursor-default">
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-teal-600 group-hover:scale-110 transition-transform origin-left duration-300">{satisfiedCount}+</h3>
                <p className={`text-xs md:text-sm mt-1 font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Pelanggan Puas</p>
              </div>
              <div className="group cursor-default">
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-teal-600 group-hover:scale-110 transition-transform origin-left duration-300">{yearsCount}+</h3>
                <p className={`text-xs md:text-sm mt-1 font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Tahun Pengalaman</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative hidden lg:block perspective-1000"
          >
            <motion.div
              animate={{
                rotateY: mousePosition.x * 5,
                rotateX: mousePosition.y * -5,
              }}
              transition={{ type: "spring", stiffness: 50, damping: 20 }}
              className="relative z-10 rounded-3xl overflow-hidden shadow-2xl shadow-teal-900/20"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
              <img
                src="https://ik.imagekit.io/dzlzhxcdo/WhatsApp_Image_2025-11-12_at_13.48.51_dd74069b_d3gxbj.jpg?updatedAt=1764432000989"
                alt="Workshop Interior"
                className="w-full h-[350px] md:h-[400px] xl:h-[500px] object-cover transform transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 p-8 z-20 transform translate-y-2 hover:translate-y-0 transition-transform duration-300">
                <div className="text-white">
                  <p className="font-bold text-xl tracking-wide mb-2">Workshop Modern</p>
                  <p className="text-gray-200 text-sm">Peralatan lengkap & Teknisi Profesional</p>
                </div>
              </div>
            </motion.div>

            {/* Floating Cards with Parallax */}
            <motion.div
              animate={{
                y: [0, -15, 0],
                x: mousePosition.x * -15,
              }}
              transition={{
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                x: { type: "spring", stiffness: 50, damping: 20 }
              }}
              className="absolute -top-8 -left-8 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl shadow-teal-900/10 z-20 flex items-center gap-4 border border-white/20"
            >
              <div className="bg-gradient-to-br from-teal-100 to-teal-50 p-3 rounded-xl text-teal-600 shadow-inner">
                <FaWrench className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-gray-900">Servis Cepat</p>
                <p className="text-xs text-gray-500 font-medium">Estimasi akurat</p>
              </div>
            </motion.div>

            <motion.div
              animate={{
                y: [0, 15, 0],
                x: mousePosition.x * -10,
              }}
              transition={{
                y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 },
                x: { type: "spring", stiffness: 50, damping: 20 }
              }}
              className="absolute -bottom-8 -right-8 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl shadow-emerald-900/10 z-20 flex items-center gap-4 border border-white/20"
            >
              <div className="bg-gradient-to-br from-emerald-100 to-emerald-50 p-3 rounded-xl text-emerald-600 shadow-inner">
                <FaCar className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-gray-900">Garansi Resmi</p>
                <p className="text-xs text-gray-500 font-medium">Jaminan kualitas</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
