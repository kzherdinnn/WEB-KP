import React, { useEffect, useState, useCallback } from "react";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaBed,
  FaClock,
  FaSync,
  FaTrash,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import PaymentStatusBadge from "../components/Payment/PaymentStatusBadge";

const MyBookings = () => {
  const { axios, user } = useAppContext();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filter, setFilter] = useState("all"); // all, paid, pending

  const fetchBookings = useCallback(
    async (silent = false) => {
      try {
        if (!silent) setIsRefreshing(true);
        const { data } = await axios.get("/api/bookings/my-bookings");
        if (data.success) {
          setBookings(data.bookings);
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
        const { data } = await axios.delete(`/api/bookings/${bookingId}`);
        if (data.success) {
          toast.success(data.message);
          setBookings(bookings.filter((booking) => booking._id !== bookingId));
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
      day: "numeric",
      month: "short",
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

  const filteredBookings = bookings.filter((booking) => {
    if (filter === "all") return true;
    if (filter === "paid") return booking.paymentStatus === "paid";
    if (filter === "pending") return booking.paymentStatus === "pending";
    return true;
  });

  const stats = {
    total: bookings.length,
    paid: bookings.filter((b) => b.paymentStatus === "paid").length,
    pending: bookings.filter((b) => b.paymentStatus === "pending").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-24 md:py-32 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 playfair mb-2">
                My Bookings
              </h1>
              <p className="text-gray-600 outfit">
                Kelola semua reservasi bengkel Anda di satu tempat
              </p>
            </div>
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className={`p-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all ${
                isRefreshing ? "animate-spin" : ""
              }`}
              title="Refresh"
            >
              <FaSync className="text-blue-600 text-xl" />
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-blue-500">
              <p className="text-sm text-gray-600 mb-1">Total Booking</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-green-500">
              <p className="text-sm text-gray-600 mb-1">Lunas</p>
              <p className="text-3xl font-bold text-green-600">{stats.paid}</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-yellow-500">
              <p className="text-sm text-gray-600 mb-1">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">
                {stats.pending}
              </p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 bg-white rounded-xl shadow-md p-2 w-fit">
            <button
              onClick={() => setFilter("all")}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                filter === "all"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Semua ({stats.total})
            </button>
            <button
              onClick={() => setFilter("paid")}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                filter === "paid"
                  ? "bg-green-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Lunas ({stats.paid})
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                filter === "pending"
                  ? "bg-yellow-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Pending ({stats.pending})
            </button>
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {filter === "all"
                ? "Belum ada booking"
                : `Tidak ada booking ${filter}`}
            </h3>
            <p className="text-gray-600 mb-6">
              Mulai booking bengkel favorit Anda sekarang!
            </p>
            <button
              onClick={() => navigate("/bengkel")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
            >
              Browse Bengkel
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => {
              const nights = calculateNights(
                booking.checkInDate,
                booking.checkOutDate,
              );

              return (
                <div
                  key={booking._id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                    {/* Image Section */}
                    <div className="lg:col-span-4 relative h-64 lg:h-auto">
                      <img
                        src={booking.room.images[0]}
                        alt={booking.room.type}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 right-4">
                        <PaymentStatusBadge status={booking.paymentStatus} />
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="lg:col-span-8 p-6">
                                      {/* Bengkel Name & Room Type */}
                      <div className="mb-4">
                        <h2 className="text-2xl font-bold text-gray-900 playfair mb-1">
                          {booking.hotel.name}
                        </h2>
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaBed className="text-blue-600" />
                          <span className="font-medium">
                            {booking.room.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 mt-1">
                          <FaMapMarkerAlt className="text-red-500 text-sm" />
                          <span className="text-sm">
                            {booking.hotel.address}
                          </span>
                        </div>
                      </div>

                      {/* Booking Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {/* Check-in */}
                        <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                          <div className="flex items-center gap-2 mb-2">
                            <FaCalendarAlt className="text-blue-600" />
                            <span className="text-xs font-semibold text-blue-900">
                              Check-in
                            </span>
                          </div>
                          <p className="text-sm font-bold text-gray-900">
                            {formatDate(booking.checkInDate)}
                          </p>
                        </div>

                        {/* Check-out */}
                        <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
                          <div className="flex items-center gap-2 mb-2">
                            <FaCalendarAlt className="text-purple-600" />
                            <span className="text-xs font-semibold text-purple-900">
                              Check-out
                            </span>
                          </div>
                          <p className="text-sm font-bold text-gray-900">
                            {formatDate(booking.checkOutDate)}
                          </p>
                        </div>

                        {/* Duration */}
                        <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                          <div className="flex items-center gap-2 mb-2">
                            <FaClock className="text-green-600" />
                            <span className="text-xs font-semibold text-green-900">
                              Durasi
                            </span>
                          </div>
                          <p className="text-sm font-bold text-gray-900">
                            {nights} Malam
                          </p>
                        </div>
                      </div>

                      {/* Guest & Room Info */}
                      <div className="flex flex-wrap gap-4 mb-4">
                        <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2">
                          <FaUsers className="text-gray-600" />
                          <span className="text-sm font-medium text-gray-900">
                            {booking.guests} Tamu
                          </span>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2">
                          <FaBed className="text-gray-600" />
                          <span className="text-sm font-medium text-gray-900">
                            {booking.numberOfRooms} Kamar
                          </span>
                        </div>
                      </div>

                      {/* Price & Actions */}
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between pt-4 border-t border-gray-200">
                        <div className="mb-4 md:mb-0">
                          <p className="text-xs text-gray-600 mb-1">
                            Total Pembayaran
                          </p>
                          <p className="text-3xl font-bold text-blue-600">
                            {formatCurrency(booking.totalPrice)}
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2">
                          {booking.paymentStatus === "pending" && (
                            <button
                              onClick={() => handleRetryPayment(booking)}
                              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
                            >
                              💳 Bayar Sekarang
                            </button>
                          )}

                          {(booking.paymentStatus === "pending" ||
                            booking.paymentStatus === "failed") && (
                            <button
                              onClick={() => handleCancel(booking._id)}
                              className="px-4 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                            >
                              <FaTrash className="text-sm" />
                              Batalkan
                            </button>
                          )}

                          {booking.paymentStatus === "paid" && (
                            <button
                              disabled
                              title="Booking sudah dibayar dan tidak bisa dibatalkan"
                              className="px-4 py-3 bg-gray-300 text-white font-semibold rounded-lg transition-all shadow-md flex items-center gap-2 opacity-60 cursor-not-allowed"
                            >
                              <FaTrash className="text-sm" />
                              Tidak bisa dibatalkan
                            </button>
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
    </div>
  );
};

export default MyBookings;
