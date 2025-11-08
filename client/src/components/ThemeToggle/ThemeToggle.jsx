import React from "react";
import { motion } from "framer-motion";
import { FiSun, FiMoon } from "react-icons/fi";
import { useAppContext } from "../../context/AppContext";

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useAppContext();

  return (
    <motion.button
      onClick={toggleTheme}
      className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
        isDarkMode
          ? "bg-gray-800 hover:bg-gray-700"
          : "bg-white hover:bg-gray-100"
      } shadow-md hover:shadow-lg`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle theme"
    >
      {/* Background Circle Animation */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          background: isDarkMode
            ? "linear-gradient(135deg, #1f2937 0%, #111827 100%)"
            : "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Sun Icon */}
      <motion.div
        initial={false}
        animate={{
          scale: isDarkMode ? 0 : 1,
          rotate: isDarkMode ? 180 : 0,
          opacity: isDarkMode ? 0 : 1,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="absolute"
      >
        <FiSun className="w-5 h-5 text-white" />
      </motion.div>

      {/* Moon Icon */}
      <motion.div
        initial={false}
        animate={{
          scale: isDarkMode ? 1 : 0,
          rotate: isDarkMode ? 0 : -180,
          opacity: isDarkMode ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="absolute"
      >
        <FiMoon className="w-5 h-5 text-gray-300" />
      </motion.div>

      {/* Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-full blur-xl opacity-30"
        animate={{
          background: isDarkMode
            ? "radial-gradient(circle, #60a5fa 0%, transparent 70%)"
            : "radial-gradient(circle, #fbbf24 0%, transparent 70%)",
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
};

export default ThemeToggle;
