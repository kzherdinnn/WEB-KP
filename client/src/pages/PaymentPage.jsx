import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { bookingsAPI } from '../utils/api';
import { formatCurrency } from '../utils/payment';
import {
    FiClock, FiCalendar, FiMapPin, FiPackage, FiTool,
    FiCreditCard, FiCheckCircle, FiArrowLeft, FiLock,
    FiShield, FiFileText, FiAlertCircle
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const MIDTRANS_SNAP_URL = "https://app.sandbox.midtrans.com/snap/snap.js";
const MIDTRANS_CLIENT_KEY = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;

export default function PaymentPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useUser();

    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [bookingData, setBookingData] = useState(null);
    const [snapToken, setSnapToken] = useState(null);
    const [bookingId, setBookingId] = useState(null);
    const [snapReady, setSnapReady] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [verifyingPayment, setVerifyingPayment] = useState(false);

    // Load Midtrans Snap Script
    useEffect(() => {
        const script = document.createElement('script');
        script.src = MIDTRANS_SNAP_URL;
        script.setAttribute('data-client-key', MIDTRANS_CLIENT_KEY);
        script.async = true;

        script.onload = () => {
            console.log('✅ Midtrans Snap loaded');
            setSnapReady(true);
        };

        script.onerror = () => {
            console.error('❌ Failed to load Midtrans Snap');
            toast.error('Gagal memuat sistem pembayaran');
        };

        document.body.appendChild(script);

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    // Initialize payment data
    useEffect(() => {
        const initPayment = async () => {
            try {
                // Get data from location state (passed from Booking page)
                if (location.state?.bookingData && location.state?.snapToken && location.state?.bookingId) {
                    setBookingData(location.state.bookingData);
                    setSnapToken(location.state.snapToken);
                    setBookingId(location.state.bookingId);
                    setLoading(false);
                    return;
                }

                // Handle retry payment from My Bookings (query parameter)
                const params = new URLSearchParams(location.search);
                const retryBookingId = params.get('bookingId');

                if (retryBookingId) {
                    setLoading(true);

                    try {
                        // Initiate new payment for this booking
                        const paymentResponse = await bookingsAPI.initiatePayment(retryBookingId, 'full');

                        // Check if booking is free
                        if (paymentResponse.data?.isFree) {
                            toast.success('Booking gratis sudah dikonfirmasi! 🎉');
                            setTimeout(() => {
                                navigate('/my-bookings', {
                                    state: { paymentSuccess: true, isFree: true }
                                });
                            }, 2000);
                            return;
                        }

                        if (!paymentResponse.data?.snapToken) {
                            throw new Error('Gagal mendapatkan token pembayaran');
                        }

                        // Fetch booking details
                        const bookingResponse = await bookingsAPI.getById(retryBookingId);

                        if (!bookingResponse.data) {
                            throw new Error('Gagal memuat data booking');
                        }

                        // Set all data
                        setBookingData(bookingResponse.data);
                        setSnapToken(paymentResponse.data.snapToken);
                        setBookingId(retryBookingId);
                        setLoading(false);
                        toast.success('Silakan lanjutkan pembayaran Anda');
                        return;
                    } catch (retryError) {
                        console.error('Retry payment error:', retryError);
                        throw new Error(retryError.message || 'Gagal memuat ulang pembayaran');
                    }
                }

                // If no data, redirect back
                toast.error('Data pembayaran tidak ditemukan');
                navigate('/booking');
            } catch (error) {
                console.error('Error initializing payment:', error);
                toast.error(error.message || 'Terjadi kesalahan saat memuat pembayaran');
                setTimeout(() => {
                    navigate('/my-bookings');
                }, 2000);
            }
        };

        initPayment();
    }, [location, navigate]);

    // Auto-embed Snap when ready
    useEffect(() => {
        if (snapReady && snapToken && !loading) {
            embedSnapPayment();
        }
    }, [snapReady, snapToken, loading]);

    const embedSnapPayment = () => {
        if (!window.snap || !snapToken) {
            console.error('Snap or token not ready');
            return;
        }

        try {
            setProcessing(true);

            // Embed Snap into container
            window.snap.embed(snapToken, {
                embedId: 'snap-container',
                onSuccess: (result) => {
                    console.log('✅ Payment Success:', result);
                    setProcessing(false);

                    // Show verifying screen
                    setVerifyingPayment(true);

                    // After 2 seconds, show success
                    setTimeout(() => {
                        setVerifyingPayment(false);
                        setPaymentSuccess(true);
                        toast.success('Pembayaran berhasil! 🎉', { duration: 2000 });

                        // Redirect after showing success
                        setTimeout(() => {
                            navigate('/my-bookings', {
                                state: { paymentSuccess: true }
                            });
                        }, 3000);
                    }, 2000);
                },
                onPending: (result) => {
                    console.log('⏳ Payment Pending:', result);
                    setProcessing(false);

                    // Show verifying screen
                    setVerifyingPayment(true);
                    toast('Pembayaran sedang diproses...', {
                        icon: '⏳',
                        duration: 4000
                    });

                    setTimeout(() => {
                        setVerifyingPayment(false);
                        navigate('/my-bookings');
                    }, 3000);
                },
                onError: (result) => {
                    console.error('❌ Payment Error:', result);
                    setProcessing(false);
                    toast.error('Terjadi kesalahan saat pembayaran');
                },
                onClose: () => {
                    console.log('Payment cancelled');
                    setProcessing(false);
                }
            });

            console.log('✅ Snap embedded successfully');
        } catch (error) {
            console.error('Error embedding Snap:', error);
            toast.error('Gagal memuat form pembayaran');
            setProcessing(false);
        }
    };

    const calculateTotal = () => {
        if (!bookingData) return { subtotal: 0, tax: 0, total: 0 };

        const sparepartsTotal = (bookingData.spareparts || []).reduce(
            (sum, item) => sum + (item.price * item.quantity), 0
        );
        const servicesTotal = (bookingData.services || []).reduce(
            (sum, item) => sum + item.price, 0
        );
        const subtotal = sparepartsTotal + servicesTotal;
        const tax = Math.round(subtotal * 0.11);

        return { subtotal, tax, total: subtotal + tax };
    };

    if (loading || !bookingData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-teal-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Memuat halaman pembayaran...</p>
                </div>
            </div>
        );
    }

    const totals = calculateTotal();
    const spareparts = bookingData.spareparts || [];
    const services = bookingData.services || [];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24 pb-12 px-4 font-outfit">
            {/* Verifying Payment Overlay */}
            {verifyingPayment && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-white rounded-3xl p-12 max-w-md mx-4 text-center shadow-2xl animate-fadeIn">
                        <div className="relative mb-6">
                            <div className="w-24 h-24 mx-auto relative">
                                {/* Outer rotating ring */}
                                <div className="absolute inset-0 border-4 border-teal-200 rounded-full animate-spin"></div>
                                {/* Inner pulsing circle */}
                                <div className="absolute inset-2 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" style={{ animationDuration: '1s' }}></div>
                                {/* Center icon */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <FiCreditCard className="w-10 h-10 text-teal-600 animate-pulse" />
                                </div>
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Memverifikasi Pembayaran</h3>
                        <p className="text-gray-600">
                            Mohon tunggu sebentar, kami sedang memproses pembayaran Anda...
                        </p>
                        <div className="flex justify-center gap-1 mt-6">
                            <div className="w-2 h-2 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Success Overlay */}
            {paymentSuccess && (
                <div className="fixed inset-0 bg-gradient-to-br from-teal-500/20 to-emerald-500/20 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-white rounded-3xl p-12 max-w-md mx-4 text-center shadow-2xl animate-fadeIn">
                        {/* Animated Checkmark */}
                        <div className="relative mb-6">
                            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg animate-scaleIn">
                                <svg className="w-12 h-12 text-white animate-drawCheck" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            {/* Confetti circles */}
                            <div className="absolute top-0 left-0 w-3 h-3 bg-yellow-400 rounded-full animate-ping" style={{ animationDelay: '0ms' }}></div>
                            <div className="absolute top-0 right-0 w-3 h-3 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '100ms' }}></div>
                            <div className="absolute bottom-0 left-4 w-3 h-3 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '200ms' }}></div>
                            <div className="absolute bottom-0 right-4 w-3 h-3 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '300ms' }}></div>
                        </div>

                        <h3 className="text-3xl font-bold text-gray-900 mb-3">Pembayaran Berhasil!</h3>
                        <p className="text-gray-600 mb-4">
                            Terima kasih! Pembayaran Anda telah berhasil diproses.
                        </p>
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                            <p className="text-sm text-green-700 font-medium">
                                ✓ Booking telah dikonfirmasi<br />
                                ✓ Invoice akan dikirim via email<br />
                                ✓ Mengarahkan ke halaman booking...
                            </p>
                        </div>

                        {/* Progress bar */}
                        <div className="mt-6 h-1 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-teal-600 to-emerald-600 animate-progressBar"></div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add CSS for animations */}
            <style>{`
                @keyframes drawCheck {
                    0% {
                        stroke-dasharray: 0 50;
                        stroke-dashoffset: 0;
                    }
                    100% {
                        stroke-dasharray: 50 50;
                        stroke-dashoffset: 0;
                    }
                }
                
                @keyframes scaleIn {
                    0% {
                        transform: scale(0);
                    }
                    50% {
                        transform: scale(1.1);
                    }
                    100% {
                        transform: scale(1);
                    }
                }
                
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes progressBar {
                    from {
                        width: 0%;
                    }
                    to {
                        width: 100%;
                    }
                }
                
                .animate-drawCheck {
                    animation: drawCheck 0.6s ease-out forwards;
                }
                
                .animate-scaleIn {
                    animation: scaleIn 0.5s ease-out;
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.4s ease-out;
                }
                
                .animate-progressBar {
                    animation: progressBar 3s linear forwards;
                }
            `}</style>
            <div className="container mx-auto max-w-6xl">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        to="/my-bookings"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium mb-4 transition-colors"
                    >
                        <FiArrowLeft /> Kembali ke Booking Saya
                    </Link>

                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    Selesaikan Pembayaran
                                </h1>
                                <p className="text-gray-600">
                                    Booking ID: <span className="font-mono font-semibold text-teal-600">{bookingId || 'Loading...'}</span>
                                </p>
                            </div>
                            <div className="flex items-center gap-2 bg-teal-50 text-teal-700 px-4 py-2 rounded-lg">
                                <FiShield className="text-xl" />
                                <span className="font-semibold text-sm">Pembayaran Aman</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Order Details & Payment Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Customer & Schedule Info */}
                        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <FiFileText className="text-teal-600" />
                                Detail Booking
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Nama Pelanggan</p>
                                        <p className="font-semibold text-gray-900">{bookingData.customerName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">No. Telepon</p>
                                        <p className="font-semibold text-gray-900">{bookingData.customerPhone}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Kendaraan</p>
                                        <p className="font-semibold text-gray-900">
                                            {bookingData.vehicleInfo?.brand} {bookingData.vehicleInfo?.model} ({bookingData.vehicleInfo?.year})
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Jadwal</p>
                                        <div className="flex items-center gap-2 text-gray-900">
                                            <FiCalendar className="text-teal-600" />
                                            <span className="font-semibold">{bookingData.scheduledDate}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-900 mt-1">
                                            <FiClock className="text-teal-600" />
                                            <span className="font-semibold">{bookingData.scheduledTime}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Lokasi</p>
                                        <div className="flex items-center gap-2 text-gray-900">
                                            <FiMapPin className="text-teal-600" />
                                            <span className="font-semibold">
                                                {bookingData.serviceLocation === 'workshop' ? 'Bengkel' : 'Home Service'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Midtrans Snap Payment Form */}
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
                            <div className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white p-6">
                                <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                                    <FiCreditCard />
                                    Pilih Metode Pembayaran
                                </h2>
                                <p className="text-teal-100 text-sm">
                                    Pilih metode pembayaran yang Anda inginkan untuk menyelesaikan transaksi
                                </p>
                            </div>

                            <div className="p-4 bg-gray-50">
                                {!snapReady ? (
                                    <div className="flex flex-col items-center justify-center py-12">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mb-4"></div>
                                        <p className="text-gray-600 font-medium">Memuat sistem pembayaran...</p>
                                    </div>
                                ) : (
                                    <>
                                        <style>{`
                                            #snap-container iframe {
                                                border: none !important;
                                                margin: 0 !important;
                                                padding: 0 !important;
                                                width: 100% !important;
                                                min-height: 600px !important;
                                            }
                                            #snap-container {
                                                margin: 0 !important;
                                                padding: 0 !important;
                                            }
                                            .snap-midtrans {
                                                margin: 0 !important;
                                                padding: 0 !important;
                                            }
                                        `}</style>

                                        <div id="snap-container" className="w-full"></div>
                                    </>
                                )}
                            </div>

                            {/* Security Info */}
                            <div className="bg-teal-50 border-t border-teal-200 p-4">
                                <div className="flex items-start gap-3">
                                    <FiLock className="text-teal-600 text-xl flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-teal-900 mb-1 text-sm">Pembayaran Aman & Terpercaya</p>
                                        <p className="text-xs text-teal-700 leading-relaxed">
                                            Transaksi Anda diproses melalui Midtrans dengan enkripsi tingkat bank.
                                            Kami tidak menyimpan informasi kartu kredit Anda.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Payment Summary (Smaller) */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            {/* Order Items Summary */}
                            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
                                <h2 className="text-lg font-bold text-gray-900 mb-4">Detail Pesanan</h2>

                                {/* Spareparts */}
                                {spareparts.length > 0 && (
                                    <div className="mb-4">
                                        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Spareparts</p>
                                        <div className="space-y-2">
                                            {spareparts.map((item, idx) => (
                                                <div key={idx} className="flex justify-between items-start text-sm">
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-900 line-clamp-1">{item.name}</p>
                                                        <p className="text-xs text-gray-500">
                                                            {formatCurrency(item.price)} × {item.quantity}
                                                        </p>
                                                    </div>
                                                    <p className="font-bold text-gray-900 ml-2">
                                                        {formatCurrency(item.price * item.quantity)}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Services */}
                                {services.length > 0 && (
                                    <div className="mb-4">
                                        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Layanan</p>
                                        <div className="space-y-2">
                                            {services.map((item, idx) => (
                                                <div key={idx} className="flex justify-between items-start text-sm">
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-900 line-clamp-1">{item.name}</p>
                                                        {item.discount > 0 && (
                                                            <div className="flex items-center gap-1 mt-0.5">
                                                                <span className="text-xs text-gray-400 line-through">
                                                                    {formatCurrency(item.originalPrice)}
                                                                </span>
                                                                <span className="text-xs bg-red-100 text-red-600 px-1 py-0.5 rounded font-bold">
                                                                    -{item.discount}%
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <p className="font-bold text-gray-900 ml-2">{formatCurrency(item.price)}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Total Summary */}
                                <div className="border-t border-gray-200 pt-4 space-y-2">
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Subtotal</span>
                                        <span className="font-semibold">{formatCurrency(totals.subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>PPN (11%)</span>
                                        <span className="font-semibold">{formatCurrency(totals.tax)}</span>
                                    </div>
                                    <div className="border-t border-gray-200 pt-2 flex justify-between items-center">
                                        <span className="font-bold text-gray-900">Total</span>
                                        <span className="text-xl font-bold text-teal-600">
                                            {formatCurrency(totals.total)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Support Info */}
                            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
                                <p className="text-sm text-gray-600 mb-2 text-center">
                                    Butuh bantuan?
                                </p>
                                <p className="text-sm font-semibold text-teal-600 text-center">
                                    📞 +62 812-3456-7890<br />
                                    📧 support@aanaudio.com
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
