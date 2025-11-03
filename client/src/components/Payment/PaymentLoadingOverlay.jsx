import React from "react";
import { motion } from "framer-motion";
import { FaSpinner, FaCreditCard, FaCheckCircle } from "react-icons/fa";

// eslint-disable-next-line no-unused-vars
const _motion = motion; // Keep motion import for potential future use

const PaymentLoadingOverlay = ({
  isVisible,
  status = "processing",
  message,
}) => {
  if (!isVisible) return null;

  const getStatusConfig = () => {
    switch (status) {
      case "processing":
        return {
          icon: <FaSpinner className="text-6xl text-blue-600 animate-spin" />,
          title: "Memproses Pembayaran",
          subtitle: message || "Mohon tunggu, jangan tutup halaman ini...",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          textColor: "text-blue-900",
        };
      case "verifying":
        return {
          icon: (
            <FaCreditCard className="text-6xl text-yellow-600 animate-pulse" />
          ),
          title: "Memverifikasi Pembayaran",
          subtitle: message || "Sedang mengkonfirmasi transaksi Anda...",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          textColor: "text-yellow-900",
        };
      case "success":
        return {
          icon: <FaCheckCircle className="text-6xl text-green-600" />,
          title: "Pembayaran Berhasil!",
          subtitle: message || "Booking Anda telah dikonfirmasi",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          textColor: "text-green-900",
        };
      default:
        return {
          icon: <FaSpinner className="text-6xl text-gray-600 animate-spin" />,
          title: "Loading...",
          subtitle: message || "Mohon tunggu...",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          textColor: "text-gray-900",
        };
    }
  };

  const config = getStatusConfig();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
        className={`${config.bgColor} border-2 ${config.borderColor} rounded-2xl p-8 shadow-2xl max-w-md w-full mx-4`}
      >
        {/* Icon */}
        <div className="flex justify-center mb-6">{config.icon}</div>

        {/* Title */}
        <h2
          className={`text-2xl font-bold text-center ${config.textColor} mb-3`}
        >
          {config.title}
        </h2>

        {/* Subtitle */}
        <p className="text-center text-gray-600 mb-6">{config.subtitle}</p>

        {/* Progress Bar */}
        {status === "processing" && (
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </div>
        )}

        {/* Additional Info */}
        {status === "processing" && (
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Proses ini mungkin memakan waktu beberapa detik
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default PaymentLoadingOverlay;
