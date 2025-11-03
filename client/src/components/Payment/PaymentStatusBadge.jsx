import React from "react";
import {
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaExclamationTriangle,
  FaHourglassHalf,
} from "react-icons/fa";

const PaymentStatusBadge = ({ status, compact = false }) => {
  const getStatusConfig = () => {
    switch (status?.toLowerCase()) {
      case "paid":
      case "success":
      case "settlement":
        return {
          icon: <FaCheckCircle />,
          text: "Lunas",
          bgColor: "bg-green-500",
          textColor: "text-white",
          borderColor: "border-green-600",
        };
      case "pending":
        return {
          icon: <FaClock />,
          text: "Pending",
          bgColor: "bg-yellow-500",
          textColor: "text-white",
          borderColor: "border-yellow-600",
        };
      case "processing":
        return {
          icon: <FaHourglassHalf className="animate-pulse" />,
          text: "Processing",
          bgColor: "bg-blue-500",
          textColor: "text-white",
          borderColor: "border-blue-600",
        };
      case "failed":
      case "deny":
      case "cancel":
        return {
          icon: <FaTimesCircle />,
          text: "Gagal",
          bgColor: "bg-red-500",
          textColor: "text-white",
          borderColor: "border-red-600",
        };
      case "expired":
        return {
          icon: <FaExclamationTriangle />,
          text: "Kadaluarsa",
          bgColor: "bg-gray-500",
          textColor: "text-white",
          borderColor: "border-gray-600",
        };
      default:
        return {
          icon: <FaClock />,
          text: "Unknown",
          bgColor: "bg-gray-500",
          textColor: "text-white",
          borderColor: "border-gray-600",
        };
    }
  };

  const config = getStatusConfig();

  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-2 ${config.bgColor} ${config.textColor} px-3 py-1.5 rounded-full text-xs font-semibold shadow-md`}
      >
        <span className="text-sm">{config.icon}</span>
        {config.text}
      </span>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2 ${config.bgColor} ${config.textColor} px-4 py-2 rounded-lg text-sm font-bold shadow-lg border-2 ${config.borderColor}`}
    >
      <span className="text-lg">{config.icon}</span>
      <span>{config.text}</span>
    </div>
  );
};

export default PaymentStatusBadge;
