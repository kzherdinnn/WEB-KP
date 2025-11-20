import React from "react";
import {
  FaHotel,
  FaBed,
  FaCalendarAlt,
  FaUsers,
  FaMoon,
  FaMapMarkerAlt,
} from "react-icons/fa";

const BookingSummary = ({ bookingData }) => {
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
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const calculateNights = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const nights = calculateNights(
    bookingData.checkInDate,
    bookingData.checkOutDate,
  );
  const pricePerNight = bookingData.pricePerNight || 0;
  const numberOfRooms = bookingData.numberOfRooms || 1;
  const subtotal = pricePerNight * nights * numberOfRooms;

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
        <h2 className="text-2xl font-bold mb-2">Ringkasan Pemesanan</h2>
        <p className="text-blue-100 text-sm">
          Periksa kembali detail booking Anda
        </p>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Bengkel & Room Image */}
        {bookingData.roomImage && (
          <div className="relative rounded-xl overflow-hidden shadow-md">
            <img
              src={bookingData.roomImage}
              alt="Room"
              className="w-full h-48 object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <h3 className="text-white font-bold text-lg">
                {bookingData.roomType}
              </h3>
            </div>
          </div>
        )}

        {/* Bengkel Information */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <FaHotel className="text-blue-600 text-xl mt-1 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-1">Bengkel</p>
              <p className="font-semibold text-gray-900">
                {bookingData.bengkelName}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FaMapMarkerAlt className="text-blue-600 text-xl mt-1 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-1">Lokasi</p>
              <p className="text-gray-700 text-sm">
                {bookingData.bengkelAddress}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FaBed className="text-blue-600 text-xl mt-1 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-1">Tipe Kamar</p>
              <p className="font-medium text-gray-900">
                {bookingData.roomType}
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200"></div>

        {/* Stay Details */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <FaCalendarAlt className="text-blue-600" />
            Detail Menginap
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-xs text-blue-600 mb-1 font-medium">Check-in</p>
              <p className="text-sm font-semibold text-gray-900">
                {formatDate(bookingData.checkInDate)}
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-xs text-blue-600 mb-1 font-medium">
                Check-out
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {formatDate(bookingData.checkOutDate)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <FaMoon className="text-blue-600 text-xl mx-auto mb-2" />
              <p className="text-xs text-gray-600">Durasi</p>
              <p className="font-bold text-gray-900">{nights} Malam</p>
            </div>

            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <FaBed className="text-blue-600 text-xl mx-auto mb-2" />
              <p className="text-xs text-gray-600">Kamar</p>
              <p className="font-bold text-gray-900">{numberOfRooms}</p>
            </div>

            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <FaUsers className="text-blue-600 text-xl mx-auto mb-2" />
              <p className="text-xs text-gray-600">Tamu</p>
              <p className="font-bold text-gray-900">{bookingData.guests}</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200"></div>

        {/* Price Breakdown */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Rincian Harga</h3>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                {formatCurrency(pricePerNight)} × {nights} malam
              </span>
              <span className="font-medium text-gray-900">
                {formatCurrency(pricePerNight * nights)}
              </span>
            </div>

            {numberOfRooms > 1 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{numberOfRooms} kamar</span>
                <span className="font-medium text-gray-900">
                  × {numberOfRooms}
                </span>
              </div>
            )}

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(subtotal)}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Pajak & Layanan (10%)</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(subtotal * 0.1)}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t-2 border-gray-300 pt-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Pembayaran</p>
                <p className="text-xs text-gray-500">Sudah termasuk pajak</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-blue-600">
                  {formatCurrency(bookingData.totalPrice || subtotal * 1.1)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <div className="text-blue-600 text-2xl">ℹ️</div>
            <div>
              <p className="text-sm font-semibold text-blue-900 mb-1">
                Informasi Penting
              </p>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Pembayaran aman dan terenkripsi</li>
                <li>• Konfirmasi booking dikirim via email</li>
                <li>• Kebijakan pembatalan: 24 jam sebelum check-in</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
