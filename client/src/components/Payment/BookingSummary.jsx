import React from "react";
import {
  FaWrench,
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaCar,
  FaMapMarkerAlt,
  FaTools,
  FaCog,
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
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Calculate totals if not provided in bookingData
  const calculateTotal = () => {
    if (bookingData.totalPrice) return bookingData.totalPrice;

    const servicesTotal =
      bookingData.services?.reduce((sum, item) => sum + item.price, 0) || 0;
    const sparepartsTotal =
      (bookingData.spareparts || bookingData.spareParts)?.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      ) || 0;

    return servicesTotal + sparepartsTotal;
  };

  const totalPrice = calculateTotal();

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white p-6">
        <h2 className="text-2xl font-bold mb-2">Ringkasan Booking</h2>
        <p className="text-teal-100 text-sm">
          Detail layanan dan sparepart yang dipesan
        </p>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Customer & Vehicle Info */}
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="bg-teal-50 p-2 rounded-lg text-teal-600">
              <FaUser className="text-lg" />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Pelanggan</p>
              <p className="font-semibold text-gray-900">
                {bookingData.customerName}
              </p>
              <p className="text-xs text-gray-600">{bookingData.customerPhone}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-teal-50 p-2 rounded-lg text-teal-600">
              <FaCar className="text-lg" />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Kendaraan</p>
              <p className="font-semibold text-gray-900">
                {bookingData.vehicleInfo?.brand || bookingData.vehicleBrand} {bookingData.vehicleInfo?.model || bookingData.vehicleModel}
              </p>
              <p className="text-xs text-gray-600">
                {bookingData.vehicleInfo?.year || bookingData.vehicleYear} • {bookingData.vehicleInfo?.plateNumber || bookingData.vehiclePlate}
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200"></div>

        {/* Schedule Info */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <FaCalendarAlt className="text-teal-600" />
            Jadwal Service
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-teal-50 rounded-lg p-3">
              <p className="text-xs text-teal-600 mb-1 font-medium">Tanggal</p>
              <p className="text-sm font-semibold text-gray-900">
                {formatDate(bookingData.scheduledDate || bookingData.serviceDate)}
              </p>
            </div>

            <div className="bg-teal-50 rounded-lg p-3">
              <p className="text-xs text-teal-600 mb-1 font-medium">Jam</p>
              <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                <FaClock className="text-xs" />
                {bookingData.scheduledTime || bookingData.timeSlot}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            <FaMapMarkerAlt className="text-teal-600" />
            <span>
              {bookingData.serviceType === "onsite"
                ? "Service di Lokasi (Home Service)"
                : "Service di Bengkel"}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200"></div>

        {/* Services & Spareparts List */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Rincian Biaya</h3>

          <div className="space-y-3">
            {/* Services */}
            {bookingData.services?.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                  <FaTools /> Jasa Service
                </p>
                {bookingData.services.map((service, idx) => (
                  <div key={`svc-${idx}`} className="flex justify-between text-sm">
                    <span className="text-gray-700">{service.name}</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(service.price)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Spareparts */}
            {(bookingData.spareparts || bookingData.spareParts)?.length > 0 && (
              <div className="space-y-2 mt-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                  <FaCog /> Sparepart
                </p>
                {(bookingData.spareparts || bookingData.spareParts).map((part, idx) => (
                  <div key={`part-${idx}`} className="flex justify-between text-sm">
                    <span className="text-gray-700">
                      {part.sparepart?.name || part.name} <span className="text-xs text-gray-500">x{part.quantity}</span>
                    </span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(part.price * part.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Total */}
          <div className="border-t-2 border-gray-300 pt-3 mt-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Estimasi</p>
                <p className="text-xs text-gray-500">Termasuk pajak & jasa</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-teal-600">
                  {formatCurrency(totalPrice)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
          <div className="flex gap-3">
            <div className="text-teal-600 text-xl">ℹ️</div>
            <div>
              <p className="text-sm font-semibold text-teal-900 mb-1">
                Catatan Penting
              </p>
              <ul className="text-xs text-teal-700 space-y-1 list-disc list-inside">
                <li>Harap datang 15 menit sebelum jadwal</li>
                <li>Garansi service 1 minggu</li>
                <li>Simpan bukti pembayaran ini</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
