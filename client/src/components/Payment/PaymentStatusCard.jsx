import React from "react";
import {
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaExclamationTriangle,
  FaHourglassHalf,
} from "react-icons/fa";

const PaymentStatusCard = ({
  status,
  amount,
  date,
  transactionId,
  className = "",
}) => {
  const getStatusConfig = () => {
    switch (status?.toLowerCase()) {
      case "paid":
      case "success":
      case "settlement":
        return {
          icon: <FaCheckCircle className="text-2xl" />,
          text: "Lunas",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          textColor: "text-green-700",
          iconColor: "text-green-600",
          badgeBg: "bg-green-100",
          badgeText: "text-green-800",
        };
      case "pending":
        return {
          icon: <FaClock className="text-2xl" />,
          text: "Menunggu Pembayaran",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          textColor: "text-yellow-700",
          iconColor: "text-yellow-600",
          badgeBg: "bg-yellow-100",
          badgeText: "text-yellow-800",
        };
      case "processing":
        return {
          icon: <FaHourglassHalf className="text-2xl animate-pulse" />,
          text: "Sedang Diproses",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          textColor: "text-blue-700",
          iconColor: "text-blue-600",
          badgeBg: "bg-blue-100",
          badgeText: "text-blue-800",
        };
      case "failed":
      case "deny":
      case "cancel":
        return {
          icon: <FaTimesCircle className="text-2xl" />,
          text: "Gagal",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          textColor: "text-red-700",
          iconColor: "text-red-600",
          badgeBg: "bg-red-100",
          badgeText: "text-red-800",
        };
      case "expired":
        return {
          icon: <FaExclamationTriangle className="text-2xl" />,
          text: "Kadaluarsa",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          textColor: "text-gray-700",
          iconColor: "text-gray-600",
          badgeBg: "bg-gray-100",
          badgeText: "text-gray-800",
        };
      default:
        return {
          icon: <FaClock className="text-2xl" />,
          text: "Status Tidak Diketahui",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          textColor: "text-gray-700",
          iconColor: "text-gray-600",
          badgeBg: "bg-gray-100",
          badgeText: "text-gray-800",
        };
    }
  };

  const config = getStatusConfig();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={`${config.bgColor} ${config.borderColor} border-2 rounded-xl p-5 ${className}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`${config.iconColor}`}>{config.icon}</div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Status Pembayaran</p>
            <span
              className={`${config.badgeBg} ${config.badgeText} px-3 py-1 rounded-full text-sm font-semibold`}
            >
              {config.text}
            </span>
          </div>
        </div>
      </div>

      {/* Amount */}
      {amount && (
        <div className="mb-3">
          <p className="text-xs text-gray-500 mb-1">Total Pembayaran</p>
          <p className={`text-2xl font-bold ${config.textColor}`}>
            {formatCurrency(amount)}
          </p>
        </div>
      )}

      {/* Transaction Details */}
      <div className="space-y-2 pt-3 border-t border-gray-300">
        {date && (
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Tanggal Transaksi</span>
            <span className="text-xs font-medium text-gray-900">
              {formatDate(date)}
            </span>
          </div>
        )}
        {transactionId && (
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">ID Transaksi</span>
            <span className="text-xs font-mono font-medium text-gray-900">
              {transactionId}
            </span>
          </div>
        )}
      </div>

      {/* Payment Instructions */}
      {(status?.toLowerCase() === "pending" ||
        status?.toLowerCase() === "processing") && (
        <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
          <p className="text-xs text-gray-600 leading-relaxed">
            {status?.toLowerCase() === "pending"
              ? "Silakan selesaikan pembayaran Anda sebelum masa berlaku habis."
              : "Pembayaran Anda sedang diverifikasi. Harap tunggu beberapa saat."}
          </p>
        </div>
      )}

      {/* Success Message */}
      {(status?.toLowerCase() === "paid" ||
        status?.toLowerCase() === "success" ||
        status?.toLowerCase() === "settlement") && (
        <div className="mt-4 p-3 bg-white rounded-lg border border-green-200">
          <p className="text-xs text-green-700 leading-relaxed">
            ✓ Pembayaran berhasil dikonfirmasi. Terima kasih atas pembayaran
            Anda!
          </p>
        </div>
      )}

      {/* Failed Message */}
      {(status?.toLowerCase() === "failed" ||
        status?.toLowerCase() === "deny" ||
        status?.toLowerCase() === "cancel") && (
        <div className="mt-4 p-3 bg-white rounded-lg border border-red-200">
          <p className="text-xs text-red-700 leading-relaxed">
            ✗ Pembayaran gagal atau dibatalkan. Silakan coba lagi atau hubungi
            customer service.
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentStatusCard;
