import { useState, useEffect } from "react";
import {
    FaUserPlus,
    FaEdit,
    FaTrash,
    FaSearch,
    FaTools,
    FaPhone,
    FaEnvelope,
    FaStar,
    FaCheckCircle,
    FaTimesCircle,
    FaBriefcase,
    FaCalendarCheck,
    FaUsers,
} from "react-icons/fa";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const ManageTechnicians = () => {
    const { axios, user } = useAppContext();
    const [technicians, setTechnicians] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedTechnician, setSelectedTechnician] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        specialization: "",
        isAvailable: true,
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [techRes, bookingRes] = await Promise.all([
                axios.get("/api/technicians"),
                axios.get("/api/bookings"),
            ]);

            if (techRes.data.success) {
                setTechnicians(techRes.data.data);
            }
            if (bookingRes.data.success) {
                setBookings(bookingRes.data.data);
            }
        } catch (error) {
            console.error(error);
            toast.error("Gagal memuat data");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                specialization: formData.specialization.split(",").map((s) => s.trim()),
            };

            if (selectedTechnician) {
                // Update
                const { data } = await axios.put(
                    `/api/technicians/${selectedTechnician._id}`,
                    payload
                );
                if (data.success) {
                    toast.success("Teknisi berhasil diperbarui");
                    setTechnicians(
                        technicians.map((t) =>
                            t._id === selectedTechnician._id ? data.data : t
                        )
                    );
                }
            } else {
                // Create
                const { data } = await axios.post("/api/technicians", payload);
                if (data.success) {
                    toast.success("Teknisi berhasil ditambahkan");
                    setTechnicians([...technicians, data.data]);
                }
            }
            closeModal();
        } catch (error) {
            toast.error(error.response?.data?.message || "Gagal menyimpan data");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus teknisi ini?")) {
            try {
                const { data } = await axios.delete(`/api/technicians/${id}`);
                if (data.success) {
                    toast.success("Teknisi berhasil dihapus");
                    setTechnicians(technicians.filter((t) => t._id !== id));
                }
            } catch (error) {
                toast.error(error.response?.data?.message || "Gagal menghapus data");
            }
        }
    };

    const openModal = (technician = null) => {
        if (technician) {
            setSelectedTechnician(technician);
            setFormData({
                name: technician.name,
                phone: technician.phone,
                email: technician.email || "",
                specialization: technician.specialization.join(", "),
                isAvailable: technician.isAvailable,
            });
        } else {
            setSelectedTechnician(null);
            setFormData({
                name: "",
                phone: "",
                email: "",
                specialization: "",
                isAvailable: true,
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedTechnician(null);
    };

    const openViewModal = (technician) => {
        setSelectedTechnician(technician);
        setShowViewModal(true);
    };

    const closeViewModal = () => {
        setShowViewModal(false);
        setSelectedTechnician(null);
    };

    const getTechnicianAssignments = (techId) => {
        return bookings.filter(
            (b) =>
                b.technician?._id === techId &&
                ["confirmed", "in_progress"].includes(b.bookingStatus)
        );
    };

    const filteredTechnicians = technicians.filter((t) =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = {
        total: technicians.length,
        available: technicians.filter((t) => t.isAvailable).length,
        onJob: technicians.filter((t) => !t.isAvailable).length, // Assuming !isAvailable means busy/on job or manually set
        // A better "On Job" metric might be checking active bookings
        active: technicians.filter((t) => getTechnicianAssignments(t._id).length > 0)
            .length,
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 font-playfair">
                        Manajemen Teknisi
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Kelola data teknisi dan penugasan
                    </p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center gap-2 shadow-lg transition-all"
                >
                    <FaUserPlus />
                    <span>Tambah Teknisi</span>
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-600 uppercase">
                                Total Teknisi
                            </p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">
                                {stats.total}
                            </p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                            <FaUsers className="text-2xl" />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-600 uppercase">
                                Tersedia
                            </p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">
                                {stats.available}
                            </p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-lg text-green-600">
                            <FaCheckCircle className="text-2xl" />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-600 uppercase">
                                Sedang Bertugas
                            </p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">
                                {stats.active}
                            </p>
                        </div>
                        <div className="bg-orange-100 p-3 rounded-lg text-orange-600">
                            <FaBriefcase className="text-2xl" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Search & Filter */}
            <div className="mb-6">
                <div className="relative max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaSearch className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Cari nama teknisi..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Technicians Grid */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTechnicians.map((tech) => {
                        const activeAssignments = getTechnicianAssignments(tech._id);
                        return (
                            <div
                                key={tech._id}
                                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 text-xl font-bold">
                                                {tech.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900">{tech.name}</h3>
                                                <div className="flex items-center gap-1 text-sm text-yellow-500">
                                                    <FaStar />
                                                    <span className="text-gray-600 font-medium">
                                                        {tech.rating || "New"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-bold ${tech.isAvailable
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                                }`}
                                        >
                                            {tech.isAvailable ? "Available" : "Unavailable"}
                                        </span>
                                    </div>

                                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                                        <div className="flex items-center gap-2">
                                            <FaPhone className="text-gray-400" />
                                            {tech.phone}
                                        </div>
                                        {tech.email && (
                                            <div className="flex items-center gap-2">
                                                <FaEnvelope className="text-gray-400" />
                                                {tech.email}
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <FaTools className="text-gray-400" />
                                            <div className="flex flex-wrap gap-1">
                                                {tech.specialization.map((spec, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="bg-gray-100 px-2 py-0.5 rounded text-xs"
                                                    >
                                                        {spec}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                                        <div className="text-xs text-gray-500">
                                            <span className="font-bold text-gray-900">
                                                {activeAssignments.length}
                                            </span>{" "}
                                            Tugas Aktif
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => openViewModal(tech)}
                                                className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                                                title="Lihat Detail"
                                            >
                                                <FaBriefcase />
                                            </button>
                                            <button
                                                onClick={() => openModal(tech)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(tech._id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Hapus"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900">
                                {selectedTechnician ? "Edit Teknisi" : "Tambah Teknisi Baru"}
                            </h2>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nama Lengkap
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nomor Telepon
                                </label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email (Opsional)
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Spesialisasi (pisahkan dengan koma)
                                </label>
                                <input
                                    type="text"
                                    name="specialization"
                                    value={formData.specialization}
                                    onChange={handleInputChange}
                                    placeholder="Contoh: Audio, Kelistrikan, Mesin"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="isAvailable"
                                    checked={formData.isAvailable}
                                    onChange={handleInputChange}
                                    id="isAvailable"
                                    className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                                />
                                <label
                                    htmlFor="isAvailable"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Status Tersedia
                                </label>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-white bg-teal-600 rounded-lg hover:bg-teal-700"
                                >
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Details Modal */}
            {showViewModal && selectedTechnician && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900">
                                Detail Teknisi: {selectedTechnician.name}
                            </h2>
                            <button
                                onClick={closeViewModal}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <FaTimesCircle className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div>
                                    <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">
                                        Info Kontak
                                    </h3>
                                    <div className="space-y-2">
                                        <p className="flex items-center gap-2 text-gray-700">
                                            <FaPhone className="text-gray-400" />{" "}
                                            {selectedTechnician.phone}
                                        </p>
                                        <p className="flex items-center gap-2 text-gray-700">
                                            <FaEnvelope className="text-gray-400" />{" "}
                                            {selectedTechnician.email || "-"}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">
                                        Status & Kinerja
                                    </h3>
                                    <div className="space-y-2">
                                        <p className="flex items-center gap-2 text-gray-700">
                                            <span
                                                className={`w-2 h-2 rounded-full ${selectedTechnician.isAvailable
                                                        ? "bg-green-500"
                                                        : "bg-red-500"
                                                    }`}
                                            ></span>
                                            {selectedTechnician.isAvailable
                                                ? "Tersedia"
                                                : "Tidak Tersedia"}
                                        </p>
                                        <p className="flex items-center gap-2 text-gray-700">
                                            <FaBriefcase className="text-gray-400" /> Total Pekerjaan:{" "}
                                            {selectedTechnician.totalJobs}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <FaCalendarCheck className="text-teal-600" /> Tugas Saat Ini
                            </h3>
                            <div className="space-y-4">
                                {getTechnicianAssignments(selectedTechnician._id).length ===
                                    0 ? (
                                    <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                        <p className="text-gray-500">
                                            Tidak ada tugas aktif saat ini.
                                        </p>
                                    </div>
                                ) : (
                                    getTechnicianAssignments(selectedTechnician._id).map(
                                        (booking) => (
                                            <div
                                                key={booking._id}
                                                className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <p className="font-bold text-gray-900">
                                                            {booking.customerName}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            {booking.vehicleInfo?.brand}{" "}
                                                            {booking.vehicleInfo?.model}
                                                        </p>
                                                    </div>
                                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
                                                        {booking.bookingStatus}
                                                    </span>
                                                </div>
                                                <div className="text-sm text-gray-600 mb-2">
                                                    <p>
                                                        {new Date(booking.scheduledDate).toLocaleDateString(
                                                            "id-ID",
                                                            {
                                                                weekday: "long",
                                                                day: "numeric",
                                                                month: "long",
                                                                year: "numeric",
                                                            }
                                                        )}{" "}
                                                        - {booking.scheduledTime}
                                                    </p>
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    ID: {booking._id}
                                                </div>
                                            </div>
                                        )
                                    )
                                )}
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl flex justify-end">
                            <button
                                onClick={closeViewModal}
                                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
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

export default ManageTechnicians;
