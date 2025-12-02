import React from "react";
import {
    FaClock,
    FaCheckCircle,
    FaTools,
    FaFlagCheckered,
    FaTimesCircle,
} from "react-icons/fa";

const BookingStatusBadge = ({ status, paymentStatus, compact = false }) => {
    const getStatusConfig = () => {
        // Special case: Pending Booking + Pending Payment = Menunggu Pembayaran
        if (status?.toLowerCase() === "pending" && paymentStatus?.toLowerCase() === "pending") {
            return {
                icon: <FaClock />,
                text: "Menunggu Pembayaran",
                bgColor: "bg-orange-100",
                textColor: "text-orange-800",
                borderColor: "border-orange-200",
            };
        }

        switch (status?.toLowerCase()) {
            case "pending":
                return {
                    icon: <FaClock />,
                    text: "Menunggu Konfirmasi",
                    bgColor: "bg-yellow-100",
                    textColor: "text-yellow-800",
                    borderColor: "border-yellow-200",
                };
            case "confirmed":
                return {
                    icon: <FaCheckCircle />,
                    text: "Dikonfirmasi",
                    bgColor: "bg-blue-100",
                    textColor: "text-blue-800",
                    borderColor: "border-blue-200",
                };
            case "in_progress":
                return {
                    icon: <FaTools />,
                    text: "Sedang Dikerjakan",
                    bgColor: "bg-purple-100",
                    textColor: "text-purple-800",
                    borderColor: "border-purple-200",
                };
            case "completed":
                return {
                    icon: <FaFlagCheckered />,
                    text: "Selesai",
                    bgColor: "bg-green-100",
                    textColor: "text-green-800",
                    borderColor: "border-green-200",
                };
            case "cancelled":
                return {
                    icon: <FaTimesCircle />,
                    text: "Dibatalkan",
                    bgColor: "bg-red-100",
                    textColor: "text-red-800",
                    borderColor: "border-red-200",
                };
            default:
                return {
                    icon: <FaClock />,
                    text: "Unknown",
                    bgColor: "bg-gray-100",
                    textColor: "text-gray-800",
                    borderColor: "border-gray-200",
                };
        }
    };

    const config = getStatusConfig();

    if (compact) {
        return (
            <span
                className={`inline-flex items-center gap-1.5 ${config.bgColor} ${config.textColor} px-2.5 py-1 rounded-full text-xs font-semibold border ${config.borderColor}`}
            >
                <span className="text-sm">{config.icon}</span>
                {config.text}
            </span>
        );
    }

    return (
        <div
            className={`inline-flex items-center gap-2 ${config.bgColor} ${config.textColor} px-3 py-1.5 rounded-lg text-sm font-medium border ${config.borderColor}`}
        >
            <span className="text-lg">{config.icon}</span>
            <span>{config.text}</span>
        </div>
    );
};

export default BookingStatusBadge;
