import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser, SignInButton } from '@clerk/clerk-react';
import { sparepartsAPI } from '../utils/api';
import { formatCurrency } from '../utils/payment';
import { FiSearch, FiFilter, FiPackage, FiAlertCircle, FiX, FiShoppingCart } from 'react-icons/fi';
import { FaSpeakerDeck, FaCompactDisc, FaMusic, FaMicrochip, FaTools, FaBolt } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function Spareparts() {
    const navigate = useNavigate();
    const { isSignedIn, isLoaded } = useUser();
    const [spareparts, setSpareparts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        category: '',
        brand: '',
        search: '',
        inStock: '',
    });

    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            toast.error('Silakan login terlebih dahulu untuk melihat produk');
            const timer = setTimeout(() => {
                navigate('/');
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [isLoaded, isSignedIn, navigate]);

    useEffect(() => {
        if (isSignedIn) {
            loadSpareparts();
        }
    }, [filters, isSignedIn]);

    const loadSpareparts = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await sparepartsAPI.getAll(filters);
            setSpareparts(response.data || []);
        } catch (error) {
            console.error('Error loading spareparts:', error);
            const errorMessage = error.response?.data?.message
                || error.message
                || 'Gagal memuat data sparepart. Silakan coba lagi nanti.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleAddToCart = (item) => {
        const bookingData = JSON.parse(localStorage.getItem('bookingData') || '{}');
        const spareparts = bookingData.spareparts || [];

        // Calculate discounted price if applicable
        const finalPrice = item.discount > 0
            ? item.price * (1 - item.discount / 100)
            : item.price;

        const existingIndex = spareparts.findIndex(s => s.sparepartId === item._id);
        if (existingIndex >= 0) {
            spareparts[existingIndex].quantity += 1;
            // Update price in case it changed (optional, but good practice)
            spareparts[existingIndex].price = finalPrice;
        } else {
            spareparts.push({
                sparepartId: item._id,
                name: item.name,
                price: finalPrice,
                quantity: 1,
                image: item.images?.[0]
            });
        }

        bookingData.spareparts = spareparts;
        localStorage.setItem('bookingData', JSON.stringify(bookingData));

        toast.success('Ditambahkan ke keranjang');
        navigate('/cart');
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'speaker': return <FaSpeakerDeck className="w-6 h-6" />;
            case 'amplifier': return <FaMusic className="w-6 h-6" />;
            case 'subwoofer': return <FaCompactDisc className="w-6 h-6" />;
            case 'headunit': return <FaMicrochip className="w-6 h-6" />;
            case 'kabel': return <FaBolt className="w-6 h-6" />;
            default: return <FaTools className="w-6 h-6" />;
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
                        <FiPackage className="w-24 h-24 text-teal-200 mx-auto mb-6" />
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Login Diperlukan</h1>
                        <p className="text-gray-600 text-lg mb-8">
                            Silakan login terlebih dahulu untuk melihat dan membeli produk sparepart kami.
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
                        Sparepart Audio Mobil
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Koleksi komponen audio premium untuk meningkatkan kualitas suara kendaraan Anda.
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
                                placeholder="Cari nama sparepart atau brand..."
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
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
                                    onChange={(e) => handleFilterChange('category', e.target.value)}
                                    className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none bg-white"
                                >
                                    <option value="">Semua Kategori</option>
                                    <option value="speaker">Speaker</option>
                                    <option value="amplifier">Amplifier</option>
                                    <option value="subwoofer">Subwoofer</option>
                                    <option value="headunit">Head Unit</option>
                                    <option value="kabel">Kabel & Wiring</option>
                                    <option value="accessory">Aksesoris</option>
                                </select>
                            </div>

                            <button
                                onClick={() => setFilters({ category: '', brand: '', search: '', inStock: '' })}
                                className="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                            >
                                <FiX className="w-4 h-4" /> Reset
                            </button>
                        </div>
                    </div>
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

                {/* Empty State */}
                {!loading && !error && spareparts.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-xl border border-gray-200 border-dashed">
                        <FiPackage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-900 mb-2">Tidak ada produk ditemukan</h3>
                        <p className="text-gray-500">Coba ubah kata kunci pencarian atau filter Anda.</p>
                    </div>
                )}

                {/* Products Grid */}
                {!loading && !error && spareparts.length > 0 && (
                    <>
                        <p className="text-gray-500 mb-6 text-sm font-medium">
                            Menampilkan {spareparts.length} produk
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {spareparts.map((item) => (
                                <div
                                    key={item._id}
                                    className={`bg-white rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col h-full group overflow-hidden ${(!item.isAvailable || item.stock === 0) ? 'opacity-75' : ''}`}
                                >
                                    {/* Image Placeholder */}
                                    <div className="h-64 bg-gray-100 flex items-center justify-center relative overflow-hidden group-hover:bg-gray-50 transition-colors">
                                        {item.images && item.images.length > 0 ? (
                                            <img
                                                src={item.images[0]}
                                                alt={item.name}
                                                className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${(!item.isAvailable || item.stock === 0) ? 'grayscale opacity-75' : ''}`}
                                            />
                                        ) : (
                                            <div className={`text-gray-400 group-hover:text-teal-600 transition-colors transform group-hover:scale-110 duration-300 ${(!item.isAvailable || item.stock === 0) ? 'grayscale' : ''}`}>
                                                {getCategoryIcon(item.category)}
                                            </div>
                                        )}
                                        {/* Category Badge */}
                                        <div className="absolute top-5 left-5">
                                            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-bold bg-white text-gray-800 shadow-md uppercase tracking-wider">
                                                {item.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 flex flex-col flex-grow">
                                        <div className="mb-2">
                                            <span className="text-xs font-bold text-teal-500 uppercase tracking-wider">
                                                {item.brand}
                                            </span>
                                        </div>

                                        <h3 className="font-bold text-teal-800 text-xl mb-4 line-clamp-2 leading-snug">
                                            {item.name}
                                        </h3>

                                        <div className="mt-auto">
                                            <div className="mb-6">
                                                <span className="text-xs text-gray-400 font-medium block mb-1">Harga</span>
                                                {item.discount > 0 ? (
                                                    <div className="flex flex-col">
                                                        <span className="text-sm text-gray-400 line-through mb-1 font-medium">
                                                            {formatCurrency(item.price)}
                                                        </span>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-2xl font-bold text-teal-600">
                                                                {formatCurrency(item.price * (1 - item.discount / 100))}
                                                            </span>
                                                            <span className="bg-red-50 text-red-500 text-[10px] font-bold px-2 py-1 rounded-md">
                                                                -{item.discount}%
                                                            </span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-2xl font-bold text-teal-600">
                                                        {formatCurrency(item.price)}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between gap-4 pt-4 border-t border-gray-50">
                                                <div className="flex items-center gap-2">
                                                    {!item.isAvailable ? (
                                                        <>
                                                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                                            <span className="text-sm font-bold text-red-500">Tidak Tersedia</span>
                                                        </>
                                                    ) : item.stock === 0 ? (
                                                        <>
                                                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                                            <span className="text-sm font-bold text-red-500">Stok Habis</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className={`w-2 h-2 rounded-full ${item.stock > item.lowStockThreshold ? 'bg-green-500' : 'bg-green-500'}`}></div>
                                                            <span className={`text-sm font-bold ${item.stock > item.lowStockThreshold ? 'text-green-600' : 'text-green-600'}`}>
                                                                Tersedia
                                                            </span>
                                                        </>
                                                    )}
                                                </div>

                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() => handleAddToCart(item)}
                                                        disabled={!item.isAvailable || item.stock === 0}
                                                        className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ${!item.isAvailable || item.stock === 0
                                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                            : 'bg-teal-50 text-teal-600 hover:bg-teal-100 hover:scale-105 active:scale-95'
                                                            }`}
                                                        title="Tambah ke Keranjang"
                                                    >
                                                        <FiShoppingCart className="w-6 h-6" />
                                                    </button>
                                                    <Link
                                                        to={`/spareparts/${item._id}`}
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
            </div>
        </div>
    );
}
