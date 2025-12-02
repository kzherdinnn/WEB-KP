import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { bookingsAPI, workshopAPI } from '../utils/api';
import { formatCurrency, initiateMidtransPayment } from '../utils/payment';
import { FiUser, FiCalendar, FiCheckCircle, FiClock, FiMapPin, FiTruck, FiCreditCard, FiChevronLeft, FiChevronRight, FiTrash2, FiPackage, FiTool } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Booking() {
    const { user } = useUser();
    const navigate = useNavigate();

    const [step, setStep] = useState(1); // 1: Info, 2: Schedule, 3: Review
    const [loading, setLoading] = useState(false);
    const [timeSlots, setTimeSlots] = useState([]);

    // Load from localStorage
    const bookingData = JSON.parse(localStorage.getItem('bookingData') || '{}');
    const spareparts = bookingData.spareparts || [];
    const services = bookingData.services || [];

    const [formData, setFormData] = useState({
        customerName: user?.fullName || '',
        customerPhone: '',
        customerEmail: user?.emailAddresses?.[0]?.emailAddress || '',
        vehicleInfo: {
            brand: '',
            model: '',
            year: '',
            plateNumber: '',
        },
        scheduledDate: '',
        scheduledTime: '',
        serviceLocation: 'workshop',
        onsiteAddress: '',
        paymentMethod: 'ewallet',
    });

    useEffect(() => {
        if (formData.scheduledDate) {
            loadTimeSlots(formData.scheduledDate);
        }
    }, [formData.scheduledDate]);

    const loadTimeSlots = async (date) => {
        try {
            const response = await workshopAPI.getTimeSlots(date);
            setTimeSlots(response.data || []);
        } catch (error) {
            console.error('Error loading time slots:', error);
            toast.error('Gagal memuat jadwal tersedia');
        }
    };

    const calculateTotal = () => {
        const sparepartsTotal = spareparts.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const servicesTotal = services.reduce((sum, item) => sum + item.price, 0);
        const subtotal = sparepartsTotal + servicesTotal;
        const tax = Math.round(subtotal * 0.11);
        return {
            subtotal,
            tax,
            total: subtotal + tax
        };
    };

    const totals = calculateTotal();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            toast.error('Silakan login terlebih dahulu');
            return;
        }

        if (spareparts.length === 0 && services.length === 0) {
            toast.error('Pilih minimal 1 sparepart atau service');
            return;
        }

        try {
            setLoading(true);

            // Determine booking type
            let bookingType = 'sparepart_only';
            if (spareparts.length > 0 && services.length > 0) {
                bookingType = 'sparepart_and_service';
            } else if (services.length > 0) {
                bookingType = 'service_only';
            }

            // Create booking
            const bookingPayload = {
                customerName: formData.customerName,
                customerPhone: formData.customerPhone,
                customerEmail: formData.customerEmail,
                vehicleInfo: formData.vehicleInfo,
                bookingType,
                spareparts: spareparts.map(s => ({
                    sparepart: s.sparepartId,
                    quantity: s.quantity,
                    price: s.price, // Include the cart price (which may be discounted)
                })),
                services: services.map(s => ({
                    service: s.serviceId,
                    price: s.price, // Include the cart price (which may be discounted)
                })),
                scheduledDate: formData.scheduledDate,
                scheduledTime: formData.scheduledTime,
                serviceLocation: formData.serviceLocation,
                onsiteAddress: formData.onsiteAddress,
                paymentMethod: formData.paymentMethod,
            };

            const bookingResponse = await bookingsAPI.create(bookingPayload);
            const booking = bookingResponse.data;

            toast.success('Booking berhasil dibuat!');

            // Clear localStorage
            localStorage.removeItem('bookingData');

            // Initiate payment
            const paymentResponse = await bookingsAPI.initiatePayment(booking._id, 'full');

            // Check if booking is free (total = 0)
            if (paymentResponse.data.isFree) {
                // Skip payment page for free bookings
                toast.success('Booking gratis berhasil dikonfirmasi! 🎉', { duration: 4000 });
                setTimeout(() => {
                    navigate('/my-bookings', {
                        state: { paymentSuccess: true, isFree: true }
                    });
                }, 2000);
                return;
            }

            // Navigate to dedicated payment page (like Shopee)
            navigate('/payment', {
                state: {
                    bookingData: booking,
                    snapToken: paymentResponse.data.snapToken,
                    bookingId: booking._id
                }
            });

        } catch (error) {
            console.error('Error creating booking:', error);
            toast.error(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const removeSparepart = (index) => {
        spareparts.splice(index, 1);
        localStorage.setItem('bookingData', JSON.stringify({ spareparts, services }));
        window.location.reload();
    };

    const removeService = (index) => {
        services.splice(index, 1);
        localStorage.setItem('bookingData', JSON.stringify({ spareparts, services }));
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 font-outfit">
                        Formulir Booking
                    </h1>
                    <p className="text-gray-600 mt-2">Lengkapi data untuk menjadwalkan layanan Anda</p>
                </div>

                {/* Progress Steps */}
                <div className="mb-10">
                    <div className="flex items-center justify-center max-w-2xl mx-auto">
                        {[
                            { id: 1, label: 'Informasi', icon: FiUser },
                            { id: 2, label: 'Jadwal', icon: FiCalendar },
                            { id: 3, label: 'Review', icon: FiCheckCircle }
                        ].map((s, idx) => (
                            <div key={s.id} className="flex items-center w-full last:w-auto">
                                <div className="flex flex-col items-center relative z-10">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${step >= s.id ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/30' : 'bg-white text-gray-400 border-2 border-gray-200'
                                        }`}>
                                        <s.icon className="w-5 h-5" />
                                    </div>
                                    <span className={`mt-2 text-sm font-medium ${step >= s.id ? 'text-teal-700' : 'text-gray-400'}`}>
                                        {s.label}
                                    </span>
                                </div>
                                {idx < 2 && (
                                    <div className={`flex-1 h-1 mx-4 -mt-6 transition-all duration-500 ${step > s.id ? 'bg-teal-600' : 'bg-gray-200'
                                        }`}></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-6 md:p-8">
                        {/* Step 1: Customer Info */}
                        {step === 1 && (
                            <div className="animate-fadeIn">
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800 border-b pb-4">
                                    <FiUser className="text-teal-600" /> Informasi Customer & Kendaraan
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-gray-700">Data Diri</h3>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap *</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.customerName}
                                                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                                                placeholder="Masukkan nama lengkap"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                No. HP / WhatsApp *
                                                <span className="ml-1 text-xs text-gray-500">(untuk notifikasi)</span>
                                            </label>
                                            <input
                                                type="tel"
                                                required
                                                placeholder="08123456789 atau 628123456789"
                                                pattern="^(08|628)[0-9]{8,11}$"
                                                title="Format: 08xxxxxxxxx atau 628xxxxxxxxx"
                                                value={formData.customerPhone}
                                                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                                            />
                                            <p className="mt-1.5 text-xs text-gray-500 flex items-center gap-1">
                                                <svg className="w-3.5 h-3.5 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                                </svg>
                                                Nomor aktif WhatsApp untuk notifikasi booking & pembayaran
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                            <input
                                                type="email"
                                                value={formData.customerEmail}
                                                onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                                                placeholder="email@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-gray-700">Data Kendaraan</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Merek *</label>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="Toyota"
                                                    value={formData.vehicleInfo.brand}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        vehicleInfo: { ...formData.vehicleInfo, brand: e.target.value }
                                                    })}
                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Model *</label>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="Avanza"
                                                    value={formData.vehicleInfo.model}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        vehicleInfo: { ...formData.vehicleInfo, model: e.target.value }
                                                    })}
                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Tahun *</label>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="2020"
                                                    value={formData.vehicleInfo.year}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        vehicleInfo: { ...formData.vehicleInfo, year: e.target.value }
                                                    })}
                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Plat</label>
                                                <input
                                                    type="text"
                                                    placeholder="B 1234 XYZ"
                                                    value={formData.vehicleInfo.plateNumber}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        vehicleInfo: { ...formData.vehicleInfo, plateNumber: e.target.value }
                                                    })}
                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setStep(2)}
                                        className="flex items-center gap-2 bg-teal-600 text-white px-8 py-3 rounded-xl hover:bg-teal-700 transition-all font-semibold shadow-lg hover:shadow-teal-500/30"
                                    >
                                        Lanjut ke Jadwal <FiChevronRight />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Schedule */}
                        {step === 2 && (
                            <div className="animate-fadeIn">
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800 border-b pb-4">
                                    <FiCalendar className="text-teal-600" /> Pilih Jadwal & Lokasi
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Pengerjaan *</label>
                                            <input
                                                type="date"
                                                required
                                                min={new Date().toISOString().split('T')[0]}
                                                value={formData.scheduledDate}
                                                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                                            />
                                        </div>

                                        {formData.scheduledDate && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Waktu Pengerjaan *</label>
                                                <div className="grid grid-cols-3 gap-3">
                                                    {timeSlots.map((slot) => (
                                                        <button
                                                            key={slot.time}
                                                            type="button"
                                                            disabled={!slot.isAvailable}
                                                            onClick={() => setFormData({ ...formData, scheduledTime: slot.time })}
                                                            className={`py-3 px-2 rounded-lg text-sm font-medium transition-all border ${formData.scheduledTime === slot.time
                                                                ? 'bg-teal-600 text-white border-teal-600 shadow-md'
                                                                : slot.isAvailable
                                                                    ? 'bg-white border-gray-200 text-gray-700 hover:border-teal-500 hover:text-teal-600'
                                                                    : 'bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed'
                                                                }`}
                                                        >
                                                            {slot.time}
                                                            <span className="block text-xs mt-1 opacity-80">
                                                                {slot.isAvailable ? `${slot.bookingsCount || 0}/${slot.maxBookings} Slot` : 'Penuh'}
                                                            </span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Lokasi Servis *</label>
                                            <div className="grid grid-cols-2 gap-4">
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, serviceLocation: 'workshop' })}
                                                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${formData.serviceLocation === 'workshop'
                                                        ? 'border-teal-600 bg-teal-50 text-teal-700'
                                                        : 'border-gray-200 hover:border-teal-200 text-gray-600'
                                                        }`}
                                                >
                                                    <FiMapPin className="w-6 h-6" />
                                                    <span className="font-medium">Di Bengkel</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, serviceLocation: 'onsite' })}
                                                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${formData.serviceLocation === 'onsite'
                                                        ? 'border-teal-600 bg-teal-50 text-teal-700'
                                                        : 'border-gray-200 hover:border-teal-200 text-gray-600'
                                                        }`}
                                                >
                                                    <FiTruck className="w-6 h-6" />
                                                    <span className="font-medium">Home Service</span>
                                                </button>
                                            </div>
                                        </div>

                                        {formData.serviceLocation === 'onsite' && (
                                            <div className="animate-fadeIn">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Alamat Lengkap *</label>
                                                <textarea
                                                    required
                                                    value={formData.onsiteAddress}
                                                    onChange={(e) => setFormData({ ...formData, onsiteAddress: e.target.value })}
                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                                                    rows="3"
                                                    placeholder="Masukkan alamat lengkap pengerjaan..."
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-4 justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="flex items-center gap-2 px-6 py-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-all font-medium"
                                    >
                                        <FiChevronLeft /> Kembali
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setStep(3)}
                                        disabled={!formData.scheduledDate || !formData.scheduledTime}
                                        className="flex items-center gap-2 bg-teal-600 text-white px-8 py-3 rounded-xl hover:bg-teal-700 transition-all font-semibold shadow-lg hover:shadow-teal-500/30 disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed"
                                    >
                                        Lanjut ke Review <FiChevronRight />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Review */}
                        {step === 3 && (
                            <div className="animate-fadeIn">
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800 border-b pb-4">
                                    <FiCheckCircle className="text-teal-600" /> Review Pesanan
                                </h2>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                                    {/* Order Items */}
                                    <div className="lg:col-span-2 space-y-6">
                                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                                            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                                <FiPackage /> Item Pesanan
                                            </h3>

                                            {/* Spareparts */}
                                            {spareparts.length > 0 && (
                                                <div className="mb-6">
                                                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Spareparts</h4>
                                                    <div className="space-y-3">
                                                        {spareparts.map((item, idx) => (
                                                            <div key={idx} className="flex justify-between items-start bg-white p-3 rounded-lg border border-gray-100">
                                                                <div>
                                                                    <p className="font-medium text-gray-900">{item.name}</p>
                                                                    <p className="text-sm text-gray-500">
                                                                        {formatCurrency(item.price)} x {item.quantity}
                                                                    </p>
                                                                </div>
                                                                <div className="flex flex-col items-end gap-2">
                                                                    <p className="font-bold text-gray-900">{formatCurrency(item.price * item.quantity)}</p>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeSparepart(idx)}
                                                                        className="text-red-500 hover:text-red-700 transition-colors"
                                                                    >
                                                                        <FiTrash2 className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Services */}
                                            {services.length > 0 && (
                                                <div className="mb-6">
                                                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Layanan</h4>
                                                    <div className="space-y-3">
                                                        {services.map((item, idx) => (
                                                            <div key={idx} className="flex justify-between items-start bg-white p-3 rounded-lg border border-gray-100">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
                                                                        <FiTool className="w-4 h-4" />
                                                                    </div>
                                                                    <p className="font-medium text-gray-900">{item.name}</p>
                                                                </div>
                                                                <div className="flex flex-col items-end gap-2">
                                                                    <p className="font-bold text-gray-900">{formatCurrency(item.price)}</p>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeService(idx)}
                                                                        className="text-red-500 hover:text-red-700 transition-colors"
                                                                    >
                                                                        <FiTrash2 className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Total */}
                                            <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
                                                <div className="flex justify-between items-center text-gray-600">
                                                    <span>Subtotal</span>
                                                    <span>{formatCurrency(totals.subtotal)}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-gray-600">
                                                    <span>PPN (11%)</span>
                                                    <span>{formatCurrency(totals.tax)}</span>
                                                </div>
                                                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                                                    <span className="text-lg font-bold text-gray-800">Total Estimasi</span>
                                                    <span className="text-2xl font-bold text-teal-600">{formatCurrency(totals.total)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Summary Sidebar */}
                                    <div className="space-y-6">
                                        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                                            <h3 className="font-semibold text-gray-800 mb-4 border-b pb-2">Ringkasan Booking</h3>
                                            <div className="space-y-4 text-sm">
                                                <div>
                                                    <p className="text-gray-500 mb-1">Customer</p>
                                                    <p className="font-medium text-gray-900">{formData.customerName}</p>
                                                    <p className="text-gray-600">{formData.customerPhone}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 mb-1">Kendaraan</p>
                                                    <p className="font-medium text-gray-900">{formData.vehicleInfo.brand} {formData.vehicleInfo.model} ({formData.vehicleInfo.year})</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 mb-1">Jadwal</p>
                                                    <div className="flex items-center gap-2 text-teal-700 bg-teal-50 px-3 py-2 rounded-lg">
                                                        <FiCalendar />
                                                        <span className="font-medium">{formData.scheduledDate} • {formData.scheduledTime}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 mb-1">Lokasi</p>
                                                    <p className="font-medium text-gray-900 flex items-center gap-2">
                                                        <FiMapPin className="text-gray-400" />
                                                        {formData.serviceLocation === 'workshop' ? 'Bengkel Resmi' : 'Home Service'}
                                                    </p>
                                                    {formData.serviceLocation === 'onsite' && (
                                                        <p className="text-gray-600 mt-1 text-xs">{formData.onsiteAddress}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                                            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                                <FiCreditCard /> Pembayaran
                                            </h3>
                                            <div className="space-y-3">
                                                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                                    <input
                                                        type="radio"
                                                        name="payment"
                                                        value="ewallet"
                                                        checked={formData.paymentMethod === 'ewallet'}
                                                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                                                        className="text-teal-600 focus:ring-teal-500"
                                                    />
                                                    <span className="text-sm font-medium text-gray-700">E-Wallet / QRIS</span>
                                                </label>
                                                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                                    <input
                                                        type="radio"
                                                        name="payment"
                                                        value="transfer"
                                                        checked={formData.paymentMethod === 'transfer'}
                                                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                                                        className="text-teal-600 focus:ring-teal-500"
                                                    />
                                                    <span className="text-sm font-medium text-gray-700">Transfer Bank</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 justify-end border-t pt-6">
                                    <button
                                        type="button"
                                        onClick={() => setStep(2)}
                                        className="flex items-center gap-2 px-6 py-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-all font-medium"
                                    >
                                        <FiChevronLeft /> Kembali
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex items-center gap-2 bg-teal-600 text-white px-8 py-3 rounded-xl hover:bg-teal-700 transition-all font-bold shadow-lg hover:shadow-teal-500/30 disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed text-lg"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Memproses...
                                            </>
                                        ) : (
                                            <>
                                                Bayar Sekarang <FiCreditCard />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}
