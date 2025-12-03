import { useEffect, useState } from "react";
import {
  FaCalendarCheck,
  FaDollarSign,
  FaSync,
  FaEye,
  FaTools,
  FaUsers,
  FaClock,
} from "react-icons/fa";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { axios, user } = useAppContext();
  const [dashboardData, setDashboardData] = useState({
    bookings: [],
    totalBookings: 0,
    totalRevenue: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    inProgressBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
  });
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [pendingData, setPendingData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchDashboardData = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      else setIsRefreshing(true);

      const [statsRes, bookingsRes, techniciansRes] = await Promise.all([
        axios.get("/api/bookings/statistics/dashboard"),
        axios.get("/api/bookings"),
        axios.get("/api/technicians"),
      ]);

      if (statsRes.data.success && bookingsRes.data.success) {
        setDashboardData({
          bookings: bookingsRes.data.data.slice(0, 5),
          totalBookings: statsRes.data.data.totalBookings,
          totalRevenue: statsRes.data.data.totalRevenue,
          pendingBookings: statsRes.data.data.pendingBookings,
          confirmedBookings: statsRes.data.data.confirmedBookings,
          inProgressBookings: statsRes.data.data.inProgressBookings,
          completedBookings: statsRes.data.data.completedBookings,
          cancelledBookings: statsRes.data.data.cancelledBookings,
        });
      }

      if (techniciansRes.data.success) {
        setTechnicians(techniciansRes.data.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat data dashboard");
    } finally {
      if (!silent) setLoading(false);
      else setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (user) fetchDashboardData();
  }, [user]);

  const handleRefresh = () => fetchDashboardData(true);

  // Initialize pending data when a booking is selected
  useEffect(() => {
    if (selectedBooking) {
      setPendingData({
        bookingStatus: selectedBooking.bookingStatus,
        technicianId: selectedBooking.technician?._id || selectedBooking.technician || "",
        technician: selectedBooking.technician // Keep full object for display if needed
      });
    } else {
      setPendingData(null);
    }
  }, [selectedBooking]);

  const handleLocalStatusChange = (newStatus) => {
    setPendingData(prev => ({ ...prev, bookingStatus: newStatus }));
  };

  const handleLocalTechnicianChange = (technicianId) => {
    setPendingData(prev => ({ ...prev, technicianId }));
  };

  const handleSaveChanges = async () => {
    if (!selectedBooking || !pendingData) return;

    setIsSaving(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      // 1. Update Status if changed
      if (pendingData.bookingStatus !== selectedBooking.bookingStatus) {
        try {
          const { data } = await axios.patch(`/api/bookings/${selectedBooking._id}/status`, {
            status: pendingData.bookingStatus
          });
          if (data.success) successCount++;
        } catch (error) {
          console.error("Failed to update status", error);
          errorCount++;
        }
      }

      // 2. Assign Technician if changed
      const currentTechId = selectedBooking.technician?._id || selectedBooking.technician || "";
      if (pendingData.technicianId !== currentTechId) {
        try {
          const { data } = await axios.post(`/api/bookings/${selectedBooking._id}/assign-technician`, {
            technicianId: pendingData.technicianId
          });
          if (data.success) successCount++;
        } catch (error) {
          console.error("Failed to assign technician", error);
          errorCount++;
        }
      }

      if (errorCount === 0 && successCount > 0) {
        toast.success("Perubahan berhasil disimpan");
        setSelectedBooking(null); // Close modal
        fetchDashboardData(true); // Refresh data
      } else if (errorCount > 0 && successCount > 0) {
        toast.warning("Beberapa perubahan berhasil, namun ada yang gagal");
        fetchDashboardData(true);
      } else if (errorCount > 0) {
        toast.error("Gagal menyimpan perubahan");
      } else {
        // No changes made
        toast.info("Tidak ada perubahan yang disimpan");
        setSelectedBooking(null);
      }

    } catch (error) {
      toast.error("Terjadi kesalahan saat menyimpan");
    } finally {
      setIsSaving(false);
    }
  };



  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-playfair">Dashboard Admin</h1>
          <p className="text-gray-600 mt-2">Ringkasan aktivitas bengkel</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className={`px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 ${isRefreshing ? "opacity-50" : ""}`}
        >
          <FaSync className={isRefreshing ? "animate-spin" : ""} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase">Total Booking</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{dashboardData.totalBookings}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg text-blue-600"><FaCalendarCheck className="text-2xl" /></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase">Pendapatan</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">Rp {dashboardData.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg text-green-600"><FaDollarSign className="text-2xl" /></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase">Pending</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{dashboardData.pendingBookings}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg text-yellow-600"><FaClock className="text-2xl" /></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase">Dikonfirmasi</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{dashboardData.confirmedBookings}</p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-lg text-indigo-600"><FaCalendarCheck className="text-2xl" /></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase">Sedang Dikerjakan</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{dashboardData.inProgressBookings}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg text-purple-600"><FaTools className="text-2xl" /></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase">Selesai</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{dashboardData.completedBookings}</p>
            </div>
            <div className="bg-teal-100 p-3 rounded-lg text-teal-600"><FaTools className="text-2xl" /></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase">Dibatalkan</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{dashboardData.cancelledBookings}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg text-red-600"><FaUsers className="text-2xl" /></div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Booking Terbaru</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Pelanggan</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Layanan</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Jadwal</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dashboardData.bookings.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">Belum ada booking</td></tr>
              ) : (
                dashboardData.bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{booking.customerName}</div>
                      <div className="text-xs text-gray-500">{booking.vehicleInfo?.brand} {booking.vehicleInfo?.model}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 capitalize">{booking.bookingType.replace(/_/g, " ")}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{formatDate(booking.scheduledDate)}</div>
                      <div className="text-xs text-gray-500">{booking.scheduledTime}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                      Rp {booking.totalPrice.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full font-semibold ${booking.bookingStatus === 'completed' ? 'bg-green-100 text-green-800' :
                        booking.bookingStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                        {booking.bookingStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="text-teal-600 hover:text-teal-800 p-2 rounded-full hover:bg-teal-50 transition-colors"
                        title="Lihat Detail"
                      >
                        <FaEye />
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-xl">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Detail Transaksi</h2>
                <p className="text-sm text-gray-500">ID: {selectedBooking._id}</p>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status Section */}
              <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex-1 min-w-[200px]">
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Status Booking</p>
                  <select
                    value={pendingData?.bookingStatus || selectedBooking.bookingStatus}
                    onChange={(e) => handleLocalStatusChange(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-semibold border-2 focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all cursor-pointer ${(pendingData?.bookingStatus || selectedBooking.bookingStatus) === 'completed' ? 'bg-green-50 border-green-200 text-green-800 focus:ring-green-500' :
                        (pendingData?.bookingStatus || selectedBooking.bookingStatus) === 'cancelled' ? 'bg-red-50 border-red-200 text-red-800 focus:ring-red-500' :
                          (pendingData?.bookingStatus || selectedBooking.bookingStatus) === 'in_progress' ? 'bg-blue-50 border-blue-200 text-blue-800 focus:ring-blue-500' :
                            (pendingData?.bookingStatus || selectedBooking.bookingStatus) === 'confirmed' ? 'bg-teal-50 border-teal-200 text-teal-800 focus:ring-teal-500' :
                              'bg-yellow-50 border-yellow-200 text-yellow-800 focus:ring-yellow-500'
                      }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="flex-1 min-w-[200px]">
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Status Pembayaran</p>
                  <div className={`px-3 py-2 rounded-lg text-sm font-semibold border border-transparent ${selectedBooking.paymentStatus === 'paid' || selectedBooking.paymentStatus === 'settlement' ? 'bg-green-100 text-green-800' :
                    selectedBooking.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                    {selectedBooking.paymentStatus ? selectedBooking.paymentStatus.toUpperCase() : 'PENDING'}
                  </div>
                </div>
                <div className="flex-1 min-w-[200px]">
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Total Biaya</p>
                  <p className="text-lg font-bold text-teal-600">Rp {selectedBooking.totalPrice.toLocaleString()}</p>
                </div>
              </div>

              {/* Technician Assignment */}
              <div className="p-4 bg-teal-50 rounded-lg border border-teal-100">
                <div className="flex items-center gap-2 mb-2">
                  <FaTools className="text-teal-600" />
                  <p className="text-sm font-bold text-teal-900 uppercase">Tugaskan Teknisi</p>
                </div>
                <div className="flex gap-2">
                  <select
                    value={pendingData?.technicianId || ""}
                    onChange={(e) => handleLocalTechnicianChange(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg text-sm border border-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    <option value="">Pilih Teknisi...</option>
                    {technicians.map((tech) => (
                      <option key={tech._id} value={tech._id}>
                        {tech.name} ({tech.specialization})
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-xs text-teal-600 mt-2">
                  *Memilih teknisi akan otomatis mengubah status booking menjadi "Confirmed"
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Info */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase border-b pb-2 mb-3">Informasi Pelanggan</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Nama:</span>
                      <span className="font-medium text-gray-900">{selectedBooking.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Telepon:</span>
                      <span className="font-medium text-gray-900">{selectedBooking.customerPhone || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Email:</span>
                      <span className="font-medium text-gray-900">{selectedBooking.customerEmail || '-'}</span>
                    </div>
                  </div>
                </div>

                {/* Vehicle Info */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase border-b pb-2 mb-3">Informasi Kendaraan</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Kendaraan:</span>
                      <span className="font-medium text-gray-900">{selectedBooking.vehicleInfo?.brand} {selectedBooking.vehicleInfo?.model}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Tahun:</span>
                      <span className="font-medium text-gray-900">{selectedBooking.vehicleInfo?.year || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Plat Nomor:</span>
                      <span className="font-medium text-gray-900">{selectedBooking.vehicleInfo?.plateNumber || '-'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Schedule Info */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase border-b pb-2 mb-3">Jadwal & Lokasi</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Tanggal:</p>
                    <p className="font-medium text-gray-900">{formatDate(selectedBooking.scheduledDate)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Jam:</p>
                    <p className="font-medium text-gray-900">{selectedBooking.scheduledTime}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Tipe Layanan:</p>
                    <p className="font-medium text-gray-900 capitalize">{selectedBooking.bookingType.replace(/_/g, " ")}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Lokasi:</p>
                    <p className="font-medium text-gray-900">{selectedBooking.serviceLocation === 'onsite' ? 'Home Service' : 'Bengkel'}</p>
                  </div>
                  {selectedBooking.serviceLocation === 'onsite' && selectedBooking.onsiteAddress && (
                    <div className="col-span-2">
                      <p className="text-gray-500">Alamat Home Service:</p>
                      <p className="font-medium text-gray-900">📍 {selectedBooking.onsiteAddress}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Items List */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase border-b pb-2 mb-3">Rincian Pesanan</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  {(!selectedBooking.services?.length && !selectedBooking.spareParts?.length) ? (
                    <div className="text-center py-2">
                      <p className="text-sm text-gray-500 italic">Tidak ada detail layanan atau sparepart</p>
                    </div>
                  ) : (
                    <>
                      {selectedBooking.services?.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-gray-500 mb-2">Layanan:</p>
                          <ul className="space-y-1">
                            {selectedBooking.services.map((svc, idx) => (
                              <li key={idx} className="text-sm flex justify-between">
                                <span>{svc.name}</span>
                                <span className="font-medium">Rp {svc.price.toLocaleString()}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {selectedBooking.spareParts?.length > 0 && (
                        <div className={selectedBooking.services?.length > 0 ? "pt-3 border-t border-gray-200" : ""}>
                          <p className="text-xs font-semibold text-gray-500 mb-2">Sparepart:</p>
                          <ul className="space-y-1">
                            {selectedBooking.spareParts.map((part, idx) => (
                              <li key={idx} className="text-sm flex justify-between">
                                <span>{part.name} (x{part.quantity})</span>
                                <span className="font-medium">Rp {(part.price * part.quantity).toLocaleString()}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl flex justify-end">
              <button
                onClick={() => setSelectedBooking(null)}
                disabled={isSaving}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium mr-3"
              >
                Batal
              </button>
              <button
                onClick={handleSaveChanges}
                disabled={isSaving}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <span>Simpan Perubahan</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
