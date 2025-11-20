import { useEffect, useState } from "react";
import {
  FaCalendarCheck,
  FaDollarSign,
  FaSync,
  FaEye,
  FaHotel,
  FaUsers,
} from "react-icons/fa";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { axios, user, setShowHotelReg } = useAppContext();
  const [dashboardData, setDashboardData] = useState({
    bookings: [],
    totalBookings: 0,
    totalRevenue: 0,
  });
  const [hasHotel, setHasHotel] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const fetchDashboardData = async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true);
      } else {
        setIsRefreshing(true);
      }
      const { data } = await axios.get("/api/bookings/bengkel");
      if (data.success) {
        setDashboardData({
          bookings: data.bookings,
          totalBookings: data.totalBookings,
          totalRevenue: data.totalRevenue,
        });
        setHasHotel(true);
      } else {
        if (data.message.includes("Bengkel tidak ditemukan")) {
          setHasHotel(false);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setHasHotel(false);
      } else {
        toast.error(error.response?.data?.message || "Gagal memuat data");
      }
    } finally {
      if (!silent) {
        setLoading(false);
      } else {
        setIsRefreshing(false);
      }
    }
  };

  const handleRefresh = () => {
    fetchDashboardData(true);
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
    const nights = Math.ceil(
      (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24),
    );
    return nights;
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  // Auto-refresh setiap 10 detik
  useEffect(() => {
    const interval = setInterval(() => {
      if (user && hasHotel) {
        fetchDashboardData(true);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [user, hasHotel]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 outfit">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Admin belum mendaftarkan bengkel
  if (!hasHotel) {
    return (
      <div className="flex items-center justify-center h-full min-h-screen">
        <div className="text-center max-w-md">
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-8">
            <svg
              className="mx-auto h-16 w-16 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <h2 className="mt-4 text-2xl font-semibold text-gray-900 playfair">
              Belum Ada Bengkel Terdaftar
            </h2>
            <p className="mt-2 text-gray-600 outfit">
              Anda perlu mendaftarkan bengkel terlebih dahulu untuk mengakses
              dashboard dan mengelola data.
            </p>
            <button
              onClick={() => setShowHotelReg(true)}
              className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition outfit font-medium"
            >
              Daftar Bengkel Sekarang
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 playfair">
              Dashboard Admin
            </h1>
            <p className="text-sm md:text-base text-gray-600 mt-2 outfit">
              Monitor your room listings, track bookings and analyze all revenue
              in one place
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 outfit font-medium ${
              isRefreshing ? "opacity-50" : ""
            }`}
            title="Refresh data"
          >
            <FaSync
              className={`text-gray-600 ${isRefreshing ? "animate-spin" : ""}`}
            />
            <span className="hidden md:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        {/* Total Bookings Card */}
        <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide outfit">
                Total Bookings
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2 outfit">
                {dashboardData.totalBookings}
              </p>
              <p className="text-xs text-gray-500 mt-1 outfit">
                All-time bookings
              </p>
            </div>
            <div className="bg-blue-100 p-4 rounded-lg">
              <FaCalendarCheck className="text-3xl text-blue-600" />
            </div>
          </div>
        </div>

        {/* Total Revenue Card */}
        <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide outfit">
                Total Revenue
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2 outfit">
                Rp{dashboardData.totalRevenue?.toLocaleString("id-ID") || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1 outfit">
                From paid bookings
              </p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg">
              <FaDollarSign className="text-3xl text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 outfit">
            Recent Bookings
          </h2>
          <p className="text-sm text-gray-600 mt-1 outfit">
            Booking terbaru dari bengkel Anda
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider outfit">
                  Guest Information
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider outfit">
                  Booking Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider outfit">
                  Check-in / Check-out
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider outfit">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider outfit">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider outfit">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dashboardData.bookings.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <FaCalendarCheck className="text-5xl text-gray-300 mb-4" />
                      <p className="text-gray-500 outfit">No bookings yet</p>
                      <p className="text-sm text-gray-400 mt-1 outfit">
                        Bookings will appear here once customers make
                        reservations
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                dashboardData.bookings.map((booking, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Guest Information */}
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <FaUsers className="text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900 outfit">
                            {booking.user?.username || "N/A"}
                          </div>
                          <div className="text-xs text-gray-500 outfit">
                            {booking.user?.email || "No email"}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Booking Details */}
                    <td className="px-6 py-4">
                      <div className="flex items-start">
                        <FaHotel className="text-gray-400 mt-1 mr-2 flex-shrink-0" />
                        <div>
                          <div className="text-sm font-medium text-gray-900 outfit">
                            {booking.room?.type || "N/A"}
                          </div>
                          <div className="text-xs text-gray-600 mt-1 outfit">
                            {booking.numberOfRooms || 1} Room
                            {(booking.numberOfRooms || 1) > 1 ? "s" : ""} •{" "}
                            {booking.guests} Guest
                            {booking.guests > 1 ? "s" : ""}
                          </div>
                          <div className="text-xs text-gray-500 mt-1 outfit">
                            {calculateNights(
                              booking.checkInDate,
                              booking.checkOutDate,
                            )}{" "}
                            Night
                            {calculateNights(
                              booking.checkInDate,
                              booking.checkOutDate,
                            ) > 1
                              ? "s"
                              : ""}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Check-in / Check-out */}
                    <td className="px-6 py-4">
                      <div className="text-xs space-y-1 outfit">
                        <div>
                          <span className="font-medium text-gray-700">In:</span>{" "}
                          <span className="text-gray-600">
                            {new Date(booking.checkInDate).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">
                            Out:
                          </span>{" "}
                          <span className="text-gray-600">
                            {new Date(booking.checkOutDate).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-gray-900 outfit">
                        Rp{booking.totalPrice?.toLocaleString("id-ID") || 0}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 outfit">
                        Total payment
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold outfit ${
                          booking.paymentStatus === "paid"
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : booking.paymentStatus === "cancelled"
                              ? "bg-red-100 text-red-800 border border-red-200"
                              : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                        }`}
                      >
                        {booking.paymentStatus === "paid"
                          ? "Paid"
                          : booking.paymentStatus === "cancelled"
                            ? "Cancelled"
                            : "Pending"}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm outfit flex items-center gap-1 transition-colors"
                      >
                        <FaEye className="text-xs" />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 playfair">
                Booking Details
              </h3>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6 space-y-6">
              {/* Guest Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 outfit">
                  Guest Information
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 outfit">Name:</span>
                    <span className="text-sm font-medium text-gray-900 outfit">
                      {selectedBooking.user?.username || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 outfit">Email:</span>
                    <span className="text-sm font-medium text-gray-900 outfit">
                      {selectedBooking.user?.email || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 outfit">
                      Total Guests:
                    </span>
                    <span className="text-sm font-medium text-gray-900 outfit">
                      {selectedBooking.guests} Person
                      {selectedBooking.guests > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>

              {/* Room Info */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 outfit">
                  Room Information
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 outfit">
                      Room Type:
                    </span>
                    <span className="text-sm font-medium text-gray-900 outfit">
                      {selectedBooking.room?.type || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 outfit">
                      Number of Rooms:
                    </span>
                    <span className="text-sm font-medium text-gray-900 outfit">
                      {selectedBooking.numberOfRooms || 1} Room
                      {(selectedBooking.numberOfRooms || 1) > 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 outfit">
                      Price per Night:
                    </span>
                    <span className="text-sm font-medium text-gray-900 outfit">
                      Rp
                      {selectedBooking.room?.pricePerNight?.toLocaleString(
                        "id-ID",
                      ) || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stay Info */}
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 outfit">
                  Stay Information
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 outfit">
                      Check-in:
                    </span>
                    <span className="text-sm font-medium text-gray-900 outfit">
                      {formatDate(selectedBooking.checkInDate)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 outfit">
                      Check-out:
                    </span>
                    <span className="text-sm font-medium text-gray-900 outfit">
                      {formatDate(selectedBooking.checkOutDate)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 outfit">
                      Duration:
                    </span>
                    <span className="text-sm font-medium text-gray-900 outfit">
                      {calculateNights(
                        selectedBooking.checkInDate,
                        selectedBooking.checkOutDate,
                      )}{" "}
                      Night
                      {calculateNights(
                        selectedBooking.checkInDate,
                        selectedBooking.checkOutDate,
                      ) > 1
                        ? "s"
                        : ""}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-yellow-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 outfit">
                  Payment Information
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 outfit">
                      Total Amount:
                    </span>
                    <span className="text-lg font-bold text-gray-900 outfit">
                      Rp
                      {selectedBooking.totalPrice?.toLocaleString("id-ID") || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 outfit">
                      Payment Status:
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold outfit ${
                        selectedBooking.paymentStatus === "paid"
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : selectedBooking.paymentStatus === "cancelled"
                            ? "bg-red-100 text-red-800 border border-red-200"
                            : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                      }`}
                    >
                      {selectedBooking.paymentStatus === "paid"
                        ? "Paid"
                        : selectedBooking.paymentStatus === "cancelled"
                          ? "Cancelled"
                          : "Pending"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 outfit">
                      Booking Date:
                    </span>
                    <span className="text-sm font-medium text-gray-900 outfit">
                      {new Date(selectedBooking.createdAt).toLocaleDateString(
                        "id-ID",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        },
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Calculation Breakdown */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 outfit">
                  Price Breakdown
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 outfit">
                      {selectedBooking.room?.pricePerNight?.toLocaleString(
                        "id-ID",
                      )}{" "}
                      ×{" "}
                      {calculateNights(
                        selectedBooking.checkInDate,
                        selectedBooking.checkOutDate,
                      )}{" "}
                      night
                      {calculateNights(
                        selectedBooking.checkInDate,
                        selectedBooking.checkOutDate,
                      ) > 1
                        ? "s"
                        : ""}{" "}
                      × {selectedBooking.numberOfRooms || 1} room
                      {(selectedBooking.numberOfRooms || 1) > 1 ? "s" : ""}
                    </span>
                    <span className="font-medium text-gray-900 outfit">
                      Rp
                      {selectedBooking.totalPrice?.toLocaleString("id-ID") || 0}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-base font-semibold text-gray-900 outfit">
                        Total
                      </span>
                      <span className="text-base font-bold text-gray-900 outfit">
                        Rp
                        {selectedBooking.totalPrice?.toLocaleString("id-ID") ||
                          0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 px-6 py-4 flex justify-end">
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium outfit"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
