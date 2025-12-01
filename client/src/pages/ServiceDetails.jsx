import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { servicesAPI } from '../utils/api';
import { formatCurrency } from '../utils/payment';
import {
    FaArrowLeft,
    FaWrench,
    FaTools,
    FaCogs,
    FaComments,
    FaBoxOpen,
    FaCarBattery,
    FaClipboardList,
    FaClock,
    FaCheckCircle,
    FaShoppingCart,
    FaTimesCircle,
    FaExclamationTriangle
} from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function ServiceDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadService();
    }, [id]);

    const loadService = async () => {
        try {
            setLoading(true);
            const response = await servicesAPI.getById(id);
            setService(response.data);
        } catch (error) {
            console.error('Error:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        const bookingData = JSON.parse(localStorage.getItem('bookingData') || '{}');
        const services = bookingData.services || [];

        const existingIndex = services.findIndex(s => s.serviceId === id);
        if (existingIndex >= 0) {
            toast.error('Layanan sudah ada di keranjang');
            navigate('/cart');
            return;
        }

        services.push({
            serviceId: id,
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
            case 'installation': return <FaWrench className="text-9xl text-white" />;
            case 'repair': return <FaTools className="text-9xl text-white" />;
            case 'upgrade': return <FaCogs className="text-9xl text-white" />;
            case 'consultation': return <FaComments className="text-9xl text-white" />;
            case 'package': return <FaBoxOpen className="text-9xl text-white" />;
            default: return <FaCarBattery className="text-9xl text-white" />;
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            </div>
        );
    }

    if (error || !service) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <FaExclamationTriangle className="text-red-500 text-5xl mx-auto mb-4" />
                    <p className="text-red-600 text-xl mb-4">{error || 'Layanan tidak ditemukan'}</p>
                    <Link to="/services" className="text-teal-600 hover:underline flex items-center justify-center gap-2">
                        <FaArrowLeft /> Kembali ke daftar layanan
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
                    <Link to="/services" className="inline-flex items-center text-teal-600 hover:text-teal-800 transition-colors font-medium">
                        <FaArrowLeft className="mr-2" /> Kembali ke Layanan
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Column - Image & Details */}
                    <div className="space-y-8">
                        {/* Image Placeholder */}
                        <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl h-96 flex items-center justify-center shadow-lg transform hover:scale-[1.02] transition-transform duration-300 overflow-hidden relative">
                            {service.images && service.images.length > 0 ? (
                                <img
                                    src={service.images[0]}
                                    alt={service.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                getCategoryIcon(service.category)
                            )}
                        </div>

                        {/* Description */}
                        <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900">
                                <FaClipboardList className="text-teal-600" /> Deskripsi Layanan
                            </h2>
                            <p className="text-gray-600 leading-relaxed">{service.description}</p>
                        </div>

                        {/* Included Items */}
                        {service.includedItems && service.includedItems.length > 0 && (
                            <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900">
                                    <FaBoxOpen className="text-teal-600" /> Termasuk dalam Paket
                                </h2>
                                <ul className="space-y-3">
                                    {service.includedItems.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-gray-700">
                                            <FaCheckCircle className="text-teal-500 mt-1 flex-shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Info & Actions */}
                    <div className="space-y-8">
                        {/* Product Info */}
                        <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
                            <div className="mb-6">
                                <span className="inline-block px-4 py-1.5 text-sm font-semibold bg-teal-50 text-teal-700 rounded-full uppercase tracking-wide">
                                    {getCategoryLabel(service.category)}
                                </span>
                            </div>

                            <h1 className="text-4xl font-bold text-gray-900 mb-2 leading-tight">
                                {service.name}
                            </h1>

                            <div className="flex items-center gap-2 text-gray-500 text-lg mb-8 bg-gray-50 p-4 rounded-xl inline-flex">
                                <FaClock className="text-teal-600" />
                                <span>Estimasi Pengerjaan: <span className="font-bold text-gray-900">{service.estimatedDuration} menit</span></span>
                            </div>

                            <div className="mb-8">
                                <p className="text-sm text-gray-500 mb-1">Harga Mulai Dari</p>
                                {service.discount > 0 ? (
                                    <div className="flex flex-col">
                                        <span className="text-lg text-gray-400 line-through">
                                            {formatCurrency(service.price)}
                                        </span>
                                        <div className="flex items-center gap-3">
                                            <p className="text-5xl font-bold text-teal-600">
                                                {formatCurrency(service.price * (1 - service.discount / 100))}
                                            </p>
                                            <span className="bg-red-100 text-red-600 text-sm font-bold px-2 py-1 rounded-lg">
                                                Hemat {service.discount}%
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-5xl font-bold text-teal-600">
                                        {formatCurrency(service.price)}
                                    </p>
                                )}
                            </div>

                            {/* Action Button */}
                            <button
                                onClick={handleAddToCart}
                                disabled={!service.isAvailable}
                                className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-3 ${!service.isAvailable
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed shadow-none'
                                    : 'bg-teal-600 text-white hover:bg-teal-700 hover:shadow-teal-500/30 hover:-translate-y-1'
                                    }`}
                            >
                                {!service.isAvailable ? (
                                    <>
                                        <FaTimesCircle /> Tidak Tersedia
                                    </>
                                ) : (
                                    <>
                                        <FaShoppingCart /> Tambah ke Keranjang
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
