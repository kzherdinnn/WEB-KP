import React, { useEffect, useState } from "react";
import {
  FaTimes,
  FaCreditCard,
  FaLock,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { AnimatePresence } from "framer-motion";

const PaymentModal = ({
  isOpen,
  onClose,
  bookingDetails,
  // onPaymentSuccess,
  // onPaymentPending,
  // onPaymentError
}) => {
  const [paymentStatus, setPaymentStatus] = useState("idle"); // idle, processing, success, error
  const [countdown, setCountdown] = useState(15);

  useEffect(() => {
    if (paymentStatus === "processing") {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [paymentStatus]);

  if (!isOpen) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateNights = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm"
          onClick={onClose}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-t-2xl">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-all duration-200"
              >
                <FaTimes className="text-xl" />
              </button>

              <div className="flex items-center gap-3 mb-2">
                <FaCreditCard className="text-3xl" />
                <h2 className="text-2xl font-bold">Pembayaran Aman</h2>
              </div>

              <p className="text-blue-100 flex items-center gap-2">
                <FaLock className="text-sm" />
                <span>Transaksi dilindungi dengan enkripsi SSL</span>
              </p>
            </div>

            {/* Body */}
            <div className="p-6">
              {/* Booking Summary */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Ringkasan Pemesanan
                </h3>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 space-y-3">
                  {/* Hotel & Room Info */}
                  <div className="flex justify-between items-start pb-3 border-b border-gray-300">
                    <div>
                      <p className="text-sm text-gray-600">Hotel</p>
                      <p className="font-semibold text-gray-900">
                        {bookingDetails?.hotelName || "Hotel Name"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Tipe Kamar</p>
                      <p className="font-semibold text-gray-900">
                        {bookingDetails?.roomType || "Room Type"}
                      </p>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-4 pb-3 border-b border-gray-300">
                    <div>
                      <p className="text-sm text-gray-600">Check-in</p>
                      <p className="font-medium text-gray-900">
                        {formatDate(bookingDetails?.checkInDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Check-out</p>
                      <p className="font-medium text-gray-900">
                        {formatDate(bookingDetails?.checkOutDate)}
                      </p>
                    </div>
                  </div>

                  {/* Duration & Guests */}
                  <div className="grid grid-cols-3 gap-4 pb-3 border-b border-gray-300">
                    <div>
                      <p className="text-sm text-gray-600">Durasi</p>
                      <p className="font-medium text-gray-900">
                        {calculateNights(
                          bookingDetails?.checkInDate,
                          bookingDetails?.checkOutDate,
                        )}{" "}
                        Malam
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Tamu</p>
                      <p className="font-medium text-gray-900">
                        {bookingDetails?.guests || 0} Orang
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Kamar</p>
                      <p className="font-medium text-gray-900">
                        {bookingDetails?.numberOfRooms || 0} Kamar
                      </p>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {formatCurrency(bookingDetails?.pricePerNight || 0)} ×{" "}
                        {calculateNights(
                          bookingDetails?.checkInDate,
                          bookingDetails?.checkOutDate,
                        )}{" "}
                        malam × {bookingDetails?.numberOfRooms || 0} kamar
                      </span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(
                          (bookingDetails?.pricePerNight || 0) *
                            calculateNights(
                              bookingDetails?.checkInDate,
                              bookingDetails?.checkOutDate,
                            ) *
                            (bookingDetails?.numberOfRooms || 0),
                        )}
                      </span>
                    </div>

                    {/* Total */}
                    <div className="flex justify-between items-center pt-3 border-t-2 border-gray-400">
                      <span className="text-lg font-bold text-gray-900">
                        Total Pembayaran
                      </span>
                      <span className="text-2xl font-bold text-blue-600">
                        {formatCurrency(bookingDetails?.totalPrice || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Status */}
              {paymentStatus !== "idle" && (
                <div className="mb-6">
                  {paymentStatus === "processing" && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <div className="flex-1">
                        <p className="font-semibold text-blue-900">
                          Memproses Pembayaran...
                        </p>
                        <p className="text-sm text-blue-700 mt-1">
                          Mohon tunggu, kami sedang memverifikasi pembayaran
                          Anda.
                        </p>
                        <p className="text-xs text-blue-600 mt-2">
                          Auto-refresh dalam {countdown} detik
                        </p>
                      </div>
                    </div>
                  )}

                  {paymentStatus === "success" && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
                      <FaCheckCircle className="text-green-600 text-2xl flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <p className="font-semibold text-green-900">
                          Pembayaran Berhasil!
                        </p>
                        <p className="text-sm text-green-700 mt-1">
                          Booking Anda telah dikonfirmasi. Cek email untuk
                          detail pemesanan.
                        </p>
                      </div>
                    </div>
                  )}

                  {paymentStatus === "error" && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                      <FaExclamationTriangle className="text-red-600 text-2xl flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <p className="font-semibold text-red-900">
                          Pembayaran Gagal
                        </p>
                        <p className="text-sm text-red-700 mt-1">
                          Terjadi kesalahan saat memproses pembayaran. Silakan
                          coba lagi.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Payment Methods Info */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold mb-3 text-gray-700">
                  Metode Pembayaran yang Tersedia
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-white border border-gray-200 rounded-lg p-3 text-center hover:border-blue-400 transition-colors">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                      alt="Visa"
                      className="h-6 mx-auto mb-1"
                    />
                    <p className="text-xs text-gray-600">Visa</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-3 text-center hover:border-blue-400 transition-colors">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                      alt="Mastercard"
                      className="h-6 mx-auto mb-1"
                    />
                    <p className="text-xs text-gray-600">Mastercard</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-3 text-center hover:border-blue-400 transition-colors">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/e/e1/BCA_logo.svg"
                      alt="BCA"
                      className="h-6 mx-auto mb-1"
                    />
                    <p className="text-xs text-gray-600">BCA</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-3 text-center hover:border-blue-400 transition-colors">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/8/86/Gopay_logo.svg"
                      alt="GoPay"
                      className="h-6 mx-auto mb-1"
                    />
                    <p className="text-xs text-gray-600">GoPay</p>
                  </div>
                </div>
              </div>

              {/* Security Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <FaLock className="text-blue-600 text-xl flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm font-semibold text-blue-900 mb-1">
                      Keamanan Terjamin
                    </p>
                    <p className="text-xs text-blue-700 leading-relaxed">
                      Pembayaran Anda diproses melalui Midtrans dengan enkripsi
                      tingkat bank. Kami tidak menyimpan informasi kartu kredit
                      Anda.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    setPaymentStatus("processing");
                    // Trigger actual payment here
                  }}
                  disabled={paymentStatus === "processing"}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {paymentStatus === "processing" ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Memproses...
                    </span>
                  ) : (
                    "Bayar Sekarang"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;
