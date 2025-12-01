import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { sparepartsAPI } from '../utils/api';
import { formatCurrency } from '../utils/payment';
import {
    FaArrowLeft,
    FaVolumeUp,
    FaBroadcastTower,
    FaMusic,
    FaTabletAlt,
    FaPlug,
    FaTools,
    FaClipboardList,
    FaCogs,
    FaBoxOpen,
    FaShieldAlt,
    FaShoppingCart,
    FaTimesCircle,
    FaCar,
    FaCheckCircle,
    FaExclamationTriangle,
    FaInfoCircle
} from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function SparepartDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [sparepart, setSparepart] = useState(null);
    const [stockStatus, setStockStatus] = useState(null);
    const [compatibility, setCompatibility] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [vehicleInfo, setVehicleInfo] = useState({
        brand: '',
        model: '',
        year: '',
    });

    useEffect(() => {
        loadSparepart();
        checkStock();
    }, [id]);

    const loadSparepart = async () => {
        try {
            setLoading(true);
            const response = await sparepartsAPI.getById(id);
            setSparepart(response.data);
        } catch (error) {
            console.error('Error:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const checkStock = async () => {
        try {
            const response = await sparepartsAPI.checkStock(id);
            setStockStatus(response.data);
        } catch (error) {
            console.error('Error checking stock:', error);
        }
    };

    const handleCheckCompatibility = async () => {
        if (!vehicleInfo.brand || !vehicleInfo.model || !vehicleInfo.year) {
            toast.error('Mohon isi semua informasi kendaraan');
            return;
        }

        try {
            const response = await sparepartsAPI.checkCompatibility(id, vehicleInfo);
            setCompatibility(response.data);
            if (response.data.isCompatible) {
                toast.success('Sparepart kompatibel dengan kendaraan Anda!');
            } else {
                toast('Sparepart mungkin tidak kompatibel', { icon: <FaExclamationTriangle className="text-yellow-500" /> });
            }
        } catch (error) {
            console.error('Error checking compatibility:', error);
            toast.error('Gagal cek kompatibilitas');
        }
    };

    const handleAddToCart = () => {
        const bookingData = JSON.parse(localStorage.getItem('bookingData') || '{}');
        const spareparts = bookingData.spareparts || [];

        // Calculate discounted price if applicable
        const finalPrice = sparepart.discount > 0
            ? sparepart.price * (1 - sparepart.discount / 100)
            : sparepart.price;

        const existingIndex = spareparts.findIndex(s => s.sparepartId === id);
        if (existingIndex >= 0) {
            spareparts[existingIndex].quantity += 1;
            spareparts[existingIndex].price = finalPrice;
        } else {
            spareparts.push({
                sparepartId: id,
                name: sparepart.name,
                price: finalPrice,
                quantity: 1,
                image: sparepart.images?.[0]
            });
        }

        bookingData.spareparts = spareparts;
        localStorage.setItem('bookingData', JSON.stringify(bookingData));

        toast.success('Ditambahkan ke keranjang');
        navigate('/cart');
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'speaker': return <FaVolumeUp className="text-9xl text-white" />;
            case 'amplifier': return <FaBroadcastTower className="text-9xl text-white" />;
            case 'subwoofer': return <FaMusic className="text-9xl text-white" />;
            case 'headunit': return <FaTabletAlt className="text-9xl text-white" />;
            case 'kabel': return <FaPlug className="text-9xl text-white" />;
            default: return <FaTools className="text-9xl text-white" />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            </div>
        );
    }

    if (error || !sparepart) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <FaExclamationTriangle className="text-red-500 text-5xl mx-auto mb-4" />
                    <p className="text-red-600 text-xl mb-4">{error || 'Sparepart tidak ditemukan'}</p>
                    <Link to="/spareparts" className="text-teal-600 hover:underline flex items-center justify-center gap-2">
                        <FaArrowLeft /> Kembali ke daftar sparepart
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-28 pb-12 px-4 sm:px-6 lg:px-8 font-outfit">
            <div className="max-w-7xl mx-auto">
                {/* Breadcrumb */}
                <div className="mb-8">
                    <Link to="/spareparts" className="inline-flex items-center text-teal-600 hover:text-teal-800 transition-colors font-medium">
                        <FaArrowLeft className="mr-2" /> Kembali ke Spareparts
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Column - Image & Details */}
                    <div className="space-y-8">
                        {/* Image Placeholder */}
                        <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl h-96 flex items-center justify-center shadow-lg transform hover:scale-[1.02] transition-transform duration-300 overflow-hidden relative">
                            {sparepart.images && sparepart.images.length > 0 ? (
                                <img
                                    src={sparepart.images[0]}
                                    alt={sparepart.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                getCategoryIcon(sparepart.category)
                            )}
                        </div>

                        {/* Description */}
                        <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900">
                                <FaClipboardList className="text-teal-600" /> Deskripsi
                            </h2>
                            <p className="text-gray-600 leading-relaxed">{sparepart.description}</p>
                        </div>

                        {/* Specifications */}
                        <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900">
                                <FaCogs className="text-teal-600" /> Spesifikasi
                            </h2>
                            <div className="space-y-4">
                                {Object.entries(sparepart.specifications || {}).map(([key, value]) => (
                                    <div key={key} className="flex justify-between border-b border-gray-100 pb-3 last:border-0">
                                        <span className="font-medium text-gray-600 capitalize">{key}</span>
                                        <span className="text-gray-900 font-semibold">{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Info & Actions */}
                    <div className="space-y-8">
                        {/* Product Info */}
                        <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
                            <div className="mb-6">
                                <span className="inline-block px-4 py-1.5 text-sm font-semibold bg-teal-50 text-teal-700 rounded-full uppercase tracking-wide">
                                    {sparepart.category}
                                </span>
                            </div>

                            <h1 className="text-4xl font-bold text-gray-900 mb-2 leading-tight">
                                {sparepart.name}
                            </h1>

                            <p className="text-gray-500 mb-6 text-lg">
                                Brand: <span className="font-semibold text-gray-800">{sparepart.brand}</span>
                            </p>

                            {sparepart.discount > 0 ? (
                                <div className="mb-8">
                                    <p className="text-lg text-gray-400 line-through mb-2">
                                        {formatCurrency(sparepart.price)}
                                    </p>
                                    <div className="flex items-end gap-3">
                                        <p className="text-5xl font-bold text-teal-600">
                                            {formatCurrency(sparepart.price * (1 - sparepart.discount / 100))}
                                        </p>
                                        <span className="bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-lg mb-2">
                                            -{sparepart.discount}%
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-5xl font-bold text-teal-600 mb-8">
                                    {formatCurrency(sparepart.price)}
                                </p>
                            )}

                            {/* Stock Status */}
                            <div className="mb-8">
                                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <FaBoxOpen className="text-teal-600" /> Status Stok
                                </h3>
                                {stockStatus && (
                                    <div className={`p-4 rounded-xl border ${stockStatus.status === 'available' ? 'bg-green-50 border-green-200 text-green-800' :
                                        stockStatus.status === 'low_stock' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
                                            'bg-red-50 border-red-200 text-red-800'
                                        }`}>
                                        <div className="flex items-center gap-2 mb-1">
                                            {stockStatus.status === 'available' ? <FaCheckCircle /> :
                                                stockStatus.status === 'low_stock' ? <FaExclamationTriangle /> :
                                                    <FaTimesCircle />}
                                            <p className="font-bold">{stockStatus.message}</p>
                                        </div>
                                        <p className="text-sm opacity-90 ml-6">Tersedia: {stockStatus.stock} unit</p>
                                    </div>
                                )}
                            </div>

                            {/* Warranty */}
                            {sparepart.warranty > 0 && (
                                <div className="mb-8 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3">
                                    <FaShieldAlt className="text-blue-600 text-xl mt-1" />
                                    <div>
                                        <p className="font-bold text-blue-900">Garansi Resmi</p>
                                        <p className="text-sm text-blue-700">{sparepart.warranty} bulan garansi toko</p>
                                    </div>
                                </div>
                            )}

                            {/* Action Button */}
                            <button
                                onClick={handleAddToCart}
                                disabled={!stockStatus?.stock || stockStatus.stock === 0}
                                className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-3 ${!stockStatus?.stock || stockStatus.stock === 0
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed shadow-none'
                                    : 'bg-teal-600 text-white hover:bg-teal-700 hover:shadow-teal-500/30 hover:-translate-y-1'
                                    }`}
                            >
                                {!stockStatus?.stock || stockStatus.stock === 0 ? (
                                    <>
                                        <FaTimesCircle /> Stok Habis
                                    </>
                                ) : (
                                    <>
                                        <FaShoppingCart /> Tambah ke Keranjang
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Vehicle Compatibility Checker */}
                        <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900">
                                <FaCar className="text-teal-600" /> Cek Kompatibilitas
                            </h2>
                            <p className="text-gray-500 text-sm mb-4">Pastikan sparepart ini cocok dengan kendaraan Anda sebelum membeli.</p>

                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Merek Kendaraan</label>
                                    <input
                                        type="text"
                                        placeholder="Contoh: Toyota"
                                        value={vehicleInfo.brand}
                                        onChange={(e) => setVehicleInfo({ ...vehicleInfo, brand: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                                    <input
                                        type="text"
                                        placeholder="Contoh: Avanza"
                                        value={vehicleInfo.model}
                                        onChange={(e) => setVehicleInfo({ ...vehicleInfo, model: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tahun</label>
                                    <input
                                        type="text"
                                        placeholder="Contoh: 2022"
                                        value={vehicleInfo.year}
                                        onChange={(e) => setVehicleInfo({ ...vehicleInfo, year: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleCheckCompatibility}
                                className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-all font-medium flex items-center justify-center gap-2"
                            >
                                <FaInfoCircle /> Cek Sekarang
                            </button>

                            {compatibility && (
                                <div className={`mt-6 p-4 rounded-xl border flex items-start gap-3 ${compatibility.isCompatible
                                    ? 'bg-green-50 border-green-200 text-green-800'
                                    : 'bg-yellow-50 border-yellow-200 text-yellow-800'
                                    }`}>
                                    <div className="mt-1 text-lg">
                                        {compatibility.isCompatible ? <FaCheckCircle /> : <FaExclamationTriangle />}
                                    </div>
                                    <div>
                                        <p className="font-bold mb-1">
                                            {compatibility.isCompatible ? 'Kompatibel' : 'Perhatian'}
                                        </p>
                                        <p className="text-sm opacity-90">{compatibility.message}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
