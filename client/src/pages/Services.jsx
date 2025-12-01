import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser, SignInButton } from '@clerk/clerk-react';
import { servicesAPI } from '../utils/api';
import { formatCurrency } from '../utils/payment';
import { FiSearch, FiFilter, FiClock, FiCheck, FiAlertCircle, FiX, FiTool, FiSettings, FiPlus, FiShoppingCart } from 'react-icons/fi';
import { FaWrench, FaTools, FaCarBattery, FaComments, FaBoxOpen, FaCogs } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function Services() {
    const navigate = useNavigate();
    const { isSignedIn, isLoaded } = useUser();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        category: '',
        search: '',
        available: '',
    });

    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            toast.error('Silakan login terlebih dahulu untuk melihat layanan');
            const timer = setTimeout(() => {
                navigate('/');
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [isLoaded, isSignedIn, navigate]);

    useEffect(() => {
        if (isSignedIn) {
            loadServices();
        }
    }, [filters, isSignedIn]);

    const loadServices = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await servicesAPI.getAll(filters);
            setServices(response.data || []);
        } catch (error) {
            console.error('Error loading services:', error);
            const errorMessage = error.response?.data?.message
                || error.message
                || 'Gagal memuat data layanan. Silakan coba lagi nanti.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = (service) => {
        const bookingData = JSON.parse(localStorage.getItem('bookingData') || '{}');
        const services = bookingData.services || [];

        const existingIndex = services.findIndex(s => s.serviceId === service._id);
        if (existingIndex >= 0) {
            toast.error('Layanan sudah ada di keranjang');
            navigate('/cart');
            return;
        }

        services.push({
            serviceId: service._id,
            name: service.name,
            price: service.price,
            image: service.images?.[0]
        });

        bookingData.services = services;
        localStorage.setItem('bookingData', JSON.stringify(bookingData));

        toast.success('Ditambahkan ke keranjang');
        navigate('/cart');
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'installation': return <FaWrench className="w-8 h-8" />;
            case 'repair': return <FaTools className="w-8 h-8" />;
            case 'upgrade': return <FaCogs className="w-8 h-8" />;
            case 'consultation': return <FaComments className="w-8 h-8" />;
            case 'package': return <FaBoxOpen className="w-8 h-8" />;
            default: return <FaCarBattery className="w-8 h-8" />;
        }
    };

    const getCategoryLabel = (category) => {
        switch (category) {
            case 'installation': return 'Instalasi';
            case 'repair': return 'Perbaikan';
            case 'upgrade': return 'Upgrade';
            case 'consultation': return 'Konsultasi';
            case 'package': return 'Paket Spesial';
            default: return 'Lainnya';
        }
    };

    if (!isLoaded) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            </div>
        );
    }

    if (!isSignedIn) {
        return (
            <div className="min-h-screen bg-gray-50 pt-24 pb-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl mx-auto text-center py-20">
                        <FiTool className="w-24 h-24 text-teal-200 mx-auto mb-6" />
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Login Diperlukan</h1>
                        <p className="text-gray-600 text-lg mb-8">
                            Silakan login terlebih dahulu untuk melihat dan memesan layanan bengkel kami.
                        </p>
                        <SignInButton mode="modal">
                            <button className="px-8 py-4 bg-teal-600 text-white rounded-xl font-bold shadow-lg hover:bg-teal-700 hover:shadow-teal-500/30 transition-all text-lg">
                                Login Sekarang
                            </button>
                        </SignInButton>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="mb-10 text-center max-w-3xl mx-auto">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-outfit">
                        Layanan Bengkel
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Solusi profesional untuk kebutuhan audio mobil Anda, ditangani oleh teknisi berpengalaman.
                    </p>
                </div>

                {/* Filters Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-10">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative flex-1 w-full">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiSearch className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Cari layanan..."
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                            />
                        </div>

                        <div className="flex gap-4 w-full md:w-auto">
                            <div className="relative w-full md:w-48">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiFilter className="text-gray-400" />
                                </div>
                                <select
                                    value={filters.category}
                                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                                    className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none bg-white"
                                >
                                    <option value="">Semua Kategori</option>
                                    <option value="installation">Instalasi</option>
                                    <option value="repair">Perbaikan</option>
                                    <option value="upgrade">Upgrade</option>
                                    <option value="consultation">Konsultasi</option>
                                    <option value="package">Paket</option>
                                </select>
                            </div>

                            <button
                                onClick={() => setFilters({ category: '', search: '', available: '' })}
                                className="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                            >
                                <FiX className="w-4 h-4" /> Reset
                            </button>
                        </div>
                    </div>
                </div>

                {/* Floating Booking Button (Mobile) */}
                <div className="fixed bottom-6 right-6 z-40 md:hidden">
                    <Link
                        to="/booking"
                        className="flex items-center justify-center w-14 h-14 bg-teal-600 text-white rounded-full shadow-lg hover:bg-teal-700 transition-all"
                    >
                        <FiSettings className="w-6 h-6" />
                    </Link>
                </div>

                {/* Desktop Booking CTA */}
                <div className="hidden md:flex justify-end mb-8">
                    <Link
                        to="/booking"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-teal-600 transition-colors duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        <FiSettings className="w-5 h-5" />
                        Lanjut ke Booking
                    </Link>
                </div>

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-8 flex items-center gap-3">
                        <FiAlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="font-medium">{error}</p>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
                    </div>
                )}

                {/* Services Grid */}
                {!loading && !error && (
                    <>
                        {services.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-xl border border-gray-200 border-dashed">
                                <FiTool className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-medium text-gray-900 mb-2">Tidak ada layanan ditemukan</h3>
                                <p className="text-gray-500">Coba ubah kata kunci pencarian atau filter Anda.</p>
                            </div>
                        ) : (
                            <>
                                <p className="text-gray-500 mb-6 text-sm font-medium">
                                    Menampilkan {services.length} layanan
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {services.map((service) => (
                                        <div
                                            key={service._id}
                                            className={`bg-white rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group ${!service.isAvailable ? 'opacity-75' : ''}`}
                                        >
                                            {/* Image Placeholder */}
                                            <div className="h-64 bg-gray-100 flex items-center justify-center relative overflow-hidden group-hover:bg-gray-50 transition-colors">
                                                {service.images && service.images.length > 0 ? (
                                                    <img
                                                        src={service.images[0]}
                                                        alt={service.name}
                                                        className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${!service.isAvailable ? 'grayscale opacity-75' : ''}`}
                                                    />
                                                ) : (
                                                    <div className={`text-gray-400 group-hover:text-teal-600 transition-colors transform group-hover:scale-110 duration-300 ${!service.isAvailable ? 'grayscale' : ''}`}>
                                                        {getCategoryIcon(service.category)}
                                                    </div>
                                                )}
                                                {/* Category Badge */}
                                                <div className="absolute top-5 left-5">
                                                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-bold bg-white text-gray-800 shadow-md uppercase tracking-wider">
                                                        {getCategoryLabel(service.category)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="p-6 flex flex-col flex-grow">
                                                <h3 className="font-bold text-teal-800 text-xl mb-4 leading-snug">
                                                    {service.name}
                                                </h3>

                                                <div className="flex items-center gap-2 text-gray-500 text-sm mb-6">
                                                    <FiClock className="w-4 h-4 text-teal-600" />
                                                    <span>Estimasi: <span className="font-semibold text-gray-900">{service.estimatedDuration} menit</span></span>
                                                </div>

                                                <div className="mt-auto">
                                                    <div className="mb-6">
                                                        <span className="text-xs text-gray-400 font-medium block mb-1">Mulai dari</span>
                                                        {service.discount > 0 ? (
                                                            <div className="flex flex-col">
                                                                <span className="text-sm text-gray-400 line-through mb-1 font-medium">
                                                                    {formatCurrency(service.price)}
                                                                </span>
                                                                <div className="flex items-center gap-3">
                                                                    <span className="text-2xl font-bold text-teal-600">
                                                                        {formatCurrency(service.price * (1 - service.discount / 100))}
                                                                    </span>
                                                                    <span className="bg-red-50 text-red-500 text-[10px] font-bold px-2 py-1 rounded-md">
                                                                        -{service.discount}%
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <span className="text-2xl font-bold text-teal-600">
                                                                {formatCurrency(service.price)}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center justify-between gap-4 pt-4 border-t border-gray-50">
                                                        <div className="flex items-center gap-2">
                                                            {!service.isAvailable ? (
                                                                <>
                                                                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                                                    <span className="text-sm font-bold text-red-500">Tidak Tersedia</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                                                    <span className="text-sm font-bold text-green-600">Tersedia</span>
                                                                </>
                                                            )}
                                                        </div>

                                                        <div className="flex gap-3">
                                                            <button
                                                                onClick={() => handleAddToCart(service)}
                                                                disabled={!service.isAvailable}
                                                                className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ${!service.isAvailable
                                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                                    : 'bg-teal-50 text-teal-600 hover:bg-teal-100 hover:scale-105 active:scale-95'
                                                                    }`}
                                                                title="Tambah ke Keranjang"
                                                            >
                                                                {service.isAvailable ? <FiShoppingCart className="w-6 h-6" /> : <FiX className="w-6 h-6" />}
                                                            </button>
                                                            <Link
                                                                to={`/services/${service._id}`}
                                                                className="inline-flex items-center justify-center px-8 py-2 bg-[#0f172a] text-white text-sm font-bold rounded-2xl hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                                                            >
                                                                Detail
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
