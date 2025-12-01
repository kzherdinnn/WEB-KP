import React, { useEffect, useState, useCallback } from "react";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaCar,
  FaClock,
  FaSync,
  FaTrash,
  FaTools,
  FaUserCog,
  FaWrench,
  FaCreditCard,
  FaFileInvoice,
  FaEye,
  FaTimes,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaTimesCircle,
} from "react-icons/fa";
import { generateInvoice } from "../utils/invoiceGenerator";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import PaymentStatusBadge from "../components/Payment/PaymentStatusBadge";
import BookingStatusBadge from "../components/Booking/BookingStatusBadge";

const MyBookings = () => {
  const { axios, user } = useAppContext();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filter, setFilter] = useState("all"); // all, paid, pending
  const [selectedBooking, setSelectedBooking] = useState(null);

  const fetchBookings = useCallback(
    async (silent = false) => {
      try {
        if (!silent) setIsRefreshing(true);
        const { data } = await axios.get("/api/bookings/my-bookings");
        if (data.success) {
          setBookings(data.data);
        } else {
          if (!silent) toast.error(data.message);
        }
      } catch (error) {
        if (!silent) {
          toast.error(error.response?.data?.message || "Gagal memuat booking.");
        }
      } finally {
        if (!silent) setIsRefreshing(false);
      }
    },
    [axios],
  );

  const handleRetryPayment = (booking) => {
    navigate(`/payment?bookingId=${booking._id}`);
  };

  const handleCancel = async (bookingId) => {
    if (window.confirm("Apakah Anda yakin ingin membatalkan booking ini?")) {
      try {
        const { data } = await axios.post(`/api/bookings/${bookingId}/cancel`, {
          reason: "Dibatalkan oleh pengguna"
        });
        if (data.success) {
          toast.success(data.message);
          // Update the booking in the list instead of removing it
          setBookings(bookings.map(b =>
            b._id === bookingId ? { ...b, bookingStatus: 'cancelled' } : b
          ));
          if (selectedBooking && selectedBooking._id === bookingId) {
            setSelectedBooking({ ...selectedBooking, bookingStatus: 'cancelled' });
          }
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Gagal membatalkan booking.",
        );
      }
    }
  };

  const handleManualRefresh = () => {
    fetchBookings();
  };

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user, fetchBookings]);

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
      month: "short",
      year: "numeric",
    });
  };

  const filteredBookings = bookings.filter((booking) => {
    if (filter === "all") return true;
    if (filter === "paid") return booking.paymentStatus === "paid" || booking.paymentStatus === "settlement" || booking.paymentStatus === "success";
    if (filter === "pending") return booking.paymentStatus === "pending" && booking.bookingStatus !== "cancelled";
    if (filter === "cancelled") return booking.bookingStatus === "cancelled";
    return true;
  });

  const stats = {
    total: bookings.length,
    paid: bookings.filter((b) => b.paymentStatus === "paid" || b.paymentStatus === "settlement" || b.paymentStatus === "success").length,
    pending: bookings.filter((b) => b.paymentStatus === "pending" && b.bookingStatus !== "cancelled").length,
    cancelled: bookings.filter((b) => b.bookingStatus === "cancelled").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-24 md:py-32 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-outfit mb-2">
                Riwayat Booking
              </h1>
              <p className="text-gray-600 font-outfit">
                Kelola jadwal service dan pemasangan audio mobil Anda
              </p>
            </div>
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className={`p-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all ${isRefreshing ? "animate-spin" : ""
                }`}
              title="Refresh"
            >
              <FaSync className="text-teal-600 text-xl" />
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-green-500">
              <p className="text-sm text-gray-600 mb-1">Selesai / Lunas</p>
              <p className="text-3xl font-bold text-green-600">{stats.paid}</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-yellow-500">
              <p className="text-sm text-gray-600 mb-1">Menunggu Pembayaran</p>
              <p className="text-3xl font-bold text-yellow-600">
                {stats.pending}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-red-500">
              <p className="text-sm text-gray-600 mb-1">Dibatalkan</p>
              <p className="text-3xl font-bold text-red-600">
                {stats.cancelled}
              </p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 bg-white rounded-xl shadow-md p-2 w-fit">
            <button
              onClick={() => setFilter("all")}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${filter === "all"
                ? "bg-teal-600 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              Semua ({stats.total})
            </button>
            <button
              onClick={() => setFilter("paid")}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${filter === "paid"
                ? "bg-green-600 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              Lunas ({stats.paid})
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${filter === "pending"
                ? "bg-yellow-600 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              Pending ({stats.pending})
            </button>
            <button
              onClick={() => setFilter("cancelled")}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${filter === "cancelled"
                ? "bg-red-600 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              Dibatalkan ({stats.cancelled})
            </button>
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4 text-teal-200 flex justify-center">
              <FaTools />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {filter === "all"
                ? "Belum ada riwayat booking"
                : `Tidak ada booking ${filter}`}
            </h3>
            <p className="text-gray-600 mb-6">
              Jadwalkan service atau pemasangan audio mobil Anda sekarang!
            </p>
            <button
              onClick={() => navigate("/booking")}
              className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all font-bold shadow-lg hover:shadow-teal-500/30"
            >
              Booking Sekarang
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => {
              return (
                <div
                  key={booking._id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                    {/* Image Section */}
                    <div className="lg:col-span-4 relative h-48 lg:h-auto bg-gray-200">
                      <img
                        src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=1974&auto=format&fit=crop"
                        alt="Workshop Service"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 right-4">
                        {booking.bookingStatus === 'cancelled' ? (
                          <div className="inline-flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg border-2 border-red-600">
                            <span className="text-lg"><FaTimesCircle /></span>
                            <span>Dibatalkan</span>
                          </div>
                        ) : (
                          <PaymentStatusBadge status={booking.paymentStatus} />
                        )}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <p className="text-white font-bold text-lg flex items-center gap-2">
                          <FaTools className="text-teal-400" />
                          {booking.serviceType === 'onsite' ? 'Home Service' : 'Workshop Service'}
                        </p>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="lg:col-span-8 p-6">
                      {/* Header Info */}
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4 gap-4">
                        <div>
                          <h2 className="text-xl font-bold text-gray-900 font-outfit mb-1">
                            {booking.vehicleInfo?.brand} {booking.vehicleInfo?.model}
                          </h2>
                          <div className="flex flex-wrap items-center gap-2 text-gray-600 text-sm">
                            <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700 font-mono">
                              {booking.vehicleInfo?.plateNumber}
                            </span>
                            <span>• {booking.vehicleInfo?.year}</span>
                            <div className="hidden md:block h-4 w-px bg-gray-300 mx-1"></div>
                            <BookingStatusBadge status={booking.bookingStatus} paymentStatus={booking.paymentStatus} compact />
                          </div>
                        </div>

                        <div className="flex flex-col items-end">
                          <p className="text-xs text-gray-500 mb-1">Booking ID</p>
                          <p className="font-mono text-xs font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded">
                            {booking._id.slice(-8).toUpperCase()}
                          </p>
                        </div>
                      </div>

                      {/* Booking Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        {/* Date */}
                        <div className="bg-teal-50 rounded-lg p-3 border border-teal-100">
                          <div className="flex items-center gap-2 mb-2">
                            <FaCalendarAlt className="text-teal-600" />
                            <span className="text-xs font-semibold text-teal-900">
                              Tanggal
                            </span>
                          </div>
                          <p className="text-sm font-bold text-gray-900">
                            {formatDate(booking.scheduledDate)}
                          </p>
                        </div>

                        {/* Time */}
                        <div className="bg-teal-50 rounded-lg p-3 border border-teal-100">
                          <div className="flex items-center gap-2 mb-2">
                            <FaClock className="text-teal-600" />
                            <span className="text-xs font-semibold text-teal-900">
                              Jam
                            </span>
                          </div>
                          <p className="text-sm font-bold text-gray-900">
                            {booking.scheduledTime}
                          </p>
                        </div>

                        {/* Mechanic */}
                        <div className="bg-teal-50 rounded-lg p-3 border border-teal-100">
                          <div className="flex items-center gap-2 mb-2">
                            <FaUserCog className="text-teal-600" />
                            <span className="text-xs font-semibold text-teal-900">
                              Teknisi
                            </span>
                          </div>
                          <p className="text-sm font-bold text-gray-900">
                            {booking.technician
                              ? booking.technician.name
                              : (booking.bookingStatus?.toLowerCase() === "completed" || booking.bookingStatus?.toLowerCase() === "cancelled")
                                ? "-"
                                : (booking.paymentStatus === 'pending' && booking.bookingStatus === 'pending')
                                  ? "Menunggu Pembayaran"
                                  : "Menunggu Konfirmasi"}
                          </p>
                        </div>
                      </div>

                      {/* Services & Spareparts Detail */}
                      <div className="mb-6 bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Rincian Pesanan</p>

                        {(!booking.services?.length && (!booking.spareparts && !booking.spareParts)?.length) ? (
                          <p className="text-sm text-gray-500 italic">Tidak ada detail layanan atau sparepart</p>
                        ) : (
                          <div className="space-y-2">
                            {/* Services */}
                            {booking.services?.map((svc, idx) => (
                              <div key={`svc-${idx}`} className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-2">
                                  <span className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">
                                    <FaWrench className="text-xs" />
                                  </span>
                                  <span className="text-gray-700 font-medium">
                                    {svc.service?.name || svc.name || "Layanan Tidak Dikenal"}
                                  </span>
                                </div>
                                <span className="text-gray-900 font-semibold">{formatCurrency(svc.price)}</span>
                              </div>
                            ))}

                            {/* Divider if both exist */}
                            {booking.services?.length > 0 && (booking.spareparts || booking.spareParts)?.length > 0 && (
                              <div className="border-t border-gray-200 my-2"></div>
                            )}

                            {/* Spareparts */}
                            {(booking.spareparts || booking.spareParts)?.map((part, idx) => (
                              <div key={`part-${idx}`} className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-2">
                                  <span className="p-1.5 bg-orange-100 text-orange-600 rounded-lg">
                                    <FaTools className="text-xs" />
                                  </span>
                                  <span className="text-gray-700">
                                    {part.sparepart?.name || part.name || "Sparepart Tidak Dikenal"}
                                    <span className="text-gray-500 text-xs ml-1">x{part.quantity}</span>
                                  </span>
                                </div>
                                <span className="text-gray-900 font-semibold">
                                  {formatCurrency(part.price * part.quantity)}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Price & Actions */}
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between pt-4 border-t border-gray-200">
                        <div className="mb-4 md:mb-0">
                          <p className="text-xs text-gray-600 mb-1">
                            Total Estimasi Biaya
                          </p>
                          <p className="text-3xl font-bold text-teal-600">
                            {formatCurrency(booking.totalPrice)}
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => setSelectedBooking(booking)}
                            className="px-4 py-3 bg-blue-50 text-blue-600 font-semibold rounded-lg hover:bg-blue-100 transition-all border border-blue-200 flex items-center gap-2"
                          >
                            <FaEye /> Detail
                          </button>
                          {booking.paymentStatus === "pending" && (
                            <button
                              onClick={() => handleRetryPayment(booking)}
                              className="px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-teal-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 transform flex items-center gap-2"
                            >
                              <FaCreditCard /> Bayar Sekarang
                            </button>
                          )}

                          {(booking.paymentStatus === "pending" ||
                            booking.paymentStatus === "failed") && (
                              <button
                                onClick={() => handleCancel(booking._id)}
                                className="px-4 py-3 bg-gray-100 text-gray-600 font-semibold rounded-lg hover:bg-red-50 hover:text-red-600 transition-all border border-gray-200 flex items-center gap-2"
                              >
                                <FaTrash className="text-sm" />
                                Batalkan
                              </button>
                            )}

                          {(booking.paymentStatus === "paid" || booking.paymentStatus === "settlement" || booking.paymentStatus === "success") && (
                            <>
                              <button
                                onClick={() => generateInvoice(booking)}
                                className="px-4 py-3 bg-white text-teal-600 font-semibold rounded-lg hover:bg-teal-50 transition-all border border-teal-500 flex items-center gap-2"
                                title="Download Invoice"
                              >
                                <FaFileInvoice /> Invoice
                              </button>
                              <button
                                disabled
                                className="px-4 py-3 bg-gray-100 text-gray-400 font-semibold rounded-lg transition-all border border-gray-200 flex items-center gap-2 cursor-not-allowed"
                              >
                                <FaTrash className="text-sm" />
                                Tidak bisa dibatalkan
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fadeIn">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center z-10">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 font-outfit">Detail Booking</h2>
                <p className="text-sm text-gray-500 font-mono">#{selectedBooking._id.slice(-8).toUpperCase()}</p>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FaTimes className="text-xl text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status Banner */}
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Status Booking</p>
                  <BookingStatusBadge status={selectedBooking.bookingStatus} paymentStatus={selectedBooking.paymentStatus} />
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 mb-1">Status Pembayaran</p>
                  <PaymentStatusBadge status={selectedBooking.paymentStatus} compact />
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FaUser className="text-teal-600" /> Informasi Pelanggan
                </h3>
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-gray-900 text-lg mb-1">{selectedBooking.customerName}</p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <FaPhone className="text-teal-500" /> {selectedBooking.customerPhone}
                    </div>
                    {selectedBooking.customerEmail && (
                      <div className="flex items-center gap-2">
                        <FaEnvelope className="text-teal-500" /> {selectedBooking.customerEmail}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Vehicle & Schedule Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <FaCar className="text-teal-600" /> Kendaraan
                  </h3>
                  <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-2">
                    <p className="font-bold text-gray-900 text-lg">
                      {selectedBooking.vehicleInfo?.brand} {selectedBooking.vehicleInfo?.model}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="bg-gray-100 px-2 py-1 rounded font-mono text-xs">
                        {selectedBooking.vehicleInfo?.plateNumber}
                      </span>
                      <span>• {selectedBooking.vehicleInfo?.year}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <FaCalendarAlt className="text-teal-600" /> Jadwal
                  </h3>
                  <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-2">
                    <p className="font-bold text-gray-900">
                      {formatDate(selectedBooking.scheduledDate)}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <FaClock className="text-teal-500" /> {selectedBooking.scheduledTime}
                    </p>
                  </div>
                </div>
              </div>

              {/* Location & Technician */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-teal-600" /> Lokasi
                  </h3>
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <p className="font-medium text-gray-900 mb-1">
                      {selectedBooking.serviceLocation === 'onsite' ? 'Home Service' : 'Workshop Service'}
                    </p>
                    {selectedBooking.serviceLocation === 'onsite' && (
                      <p className="text-sm text-gray-600">
                        {selectedBooking.onsiteAddress || "Alamat tidak tersedia"}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <FaUserCog className="text-teal-600" /> Teknisi
                  </h3>
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <p className="font-medium text-gray-900">
                      {selectedBooking.technician?.name || "Belum ditugaskan"}
                    </p>
                    {selectedBooking.technician && (
                      <p className="text-xs text-gray-500 mt-1">
                        {selectedBooking.technician.specialization?.join(", ")}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Details (Reused Logic) */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FaFileInvoice className="text-teal-600" /> Rincian Biaya
                </h3>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="space-y-3">
                    {selectedBooking.services?.map((svc, idx) => (
                      <div key={`svc-${idx}`} className="flex justify-between items-center text-sm">
                        <span className="text-gray-700">{svc.service?.name || svc.name}</span>
                        <span className="font-medium">{formatCurrency(svc.price)}</span>
                      </div>
                    ))}
                    {selectedBooking.spareparts?.map((part, idx) => (
                      <div key={`part-${idx}`} className="flex justify-between items-center text-sm">
                        <span className="text-gray-700">
                          {part.sparepart?.name || part.name} <span className="text-xs text-gray-500">x{part.quantity}</span>
                        </span>
                        <span className="font-medium">{formatCurrency(part.price * part.quantity)}</span>
                      </div>
                    ))}

                    <div className="border-t border-gray-300 my-2 pt-2">
                      <div className="flex justify-between items-center text-sm text-gray-600 mb-1">
                        <span>Subtotal</span>
                        <span>{formatCurrency((selectedBooking.subtotalSpareparts || 0) + (selectedBooking.subtotalServices || 0))}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                        <span>PPN (11%)</span>
                        <span>{formatCurrency(selectedBooking.taxAmount || 0)}</span>
                      </div>
                      <div className="flex justify-between items-center font-bold text-lg border-t border-gray-200 pt-2">
                        <span>Total</span>
                        <span className="text-teal-600">{formatCurrency(selectedBooking.totalPrice)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end">
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-6 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
