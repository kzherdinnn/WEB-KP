import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaLock,
  FaArrowLeft,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import BookingSummary from "../components/Payment/BookingSummary";
import PaymentLoadingOverlay from "../components/Payment/PaymentLoadingOverlay";

const MIDTRANS_SNAP_URL = "https://app.sandbox.midtrans.com/snap/snap.js";
const MIDTRANS_CLIENT_KEY = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;

const CustomPaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { axios } = useAppContext();
  const snapContainerRef = useRef(null);
  const pollingIntervalRef = useRef(null);

  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [, setLoadingStatus] = useState("processing");
  const [loadingMessage, setLoadingMessage] = useState(
    "Memuat halaman pembayaran...",
  );
  const [paymentStatus, setPaymentStatus] = useState("idle"); // idle, processing, success, failed
  const [bookingData, setBookingData] = useState(null);
  const [snapToken, setSnapToken] = useState(null);
  const [bookingId, setBookingId] = useState(null);

  // Load Midtrans Snap Script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = MIDTRANS_SNAP_URL;
    script.setAttribute("data-client-key", MIDTRANS_CLIENT_KEY);
    script.async = true;

    script.onload = () => {
      console.log("✅ Midtrans Snap script loaded");
      setIsScriptLoaded(true);
    };

    script.onerror = () => {
      console.error("❌ Failed to load Midtrans Snap");
      toast.error("Gagal memuat sistem pembayaran");
      setIsLoading(false);
    };

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      stopPolling();
    };
  }, []);

  // Get booking data from location state or API
  useEffect(() => {
    const initializePayment = async () => {
      try {
        // Check if data passed from previous page
        if (location.state?.bookingData && location.state?.snapToken) {
          setBookingData(location.state.bookingData);
          setSnapToken(location.state.snapToken);
          setBookingId(location.state.bookingId);
          setIsLoading(false);
          return;
        }

        // If retry payment, get from bookingId in URL params
        const params = new URLSearchParams(location.search);
        const retryBookingId = params.get("bookingId");

        if (retryBookingId) {
          setLoadingMessage("Memuat data booking...");
          const { data } = await axios.post("/api/bookings/pay", {
            bookingId: retryBookingId,
          });

          if (data.success && data.token) {
            // Fetch full booking details
            const bookingResponse = await axios.get(
              `/api/bookings/${retryBookingId}`,
            );
            setBookingData(bookingResponse.data.booking);
            setSnapToken(data.token);
            setBookingId(retryBookingId);
            setIsLoading(false);
          } else {
            toast.error("Gagal memuat data pembayaran");
            navigate("/my-bookings");
          }
        } else {
          toast.error("Data pembayaran tidak ditemukan");
          navigate("/");
        }
      } catch (error) {
        console.error("Error initializing payment:", error);
        toast.error("Terjadi kesalahan saat memuat pembayaran");
        navigate("/my-bookings");
      }
    };

    initializePayment();
  }, [location, axios, navigate]);

  // Embed Snap when ready
  useEffect(() => {
    if (isScriptLoaded && snapToken && snapContainerRef.current && !isLoading) {
      embedSnapPayment();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScriptLoaded, snapToken, isLoading]);

  const embedSnapPayment = () => {
    if (!window.snap) {
      toast.error("Sistem pembayaran belum siap");
      return;
    }

    try {
      setLoadingMessage("Memuat form pembayaran...");
      setLoadingStatus("processing");

      // Clear previous embed
      if (snapContainerRef.current) {
        snapContainerRef.current.innerHTML = "";
      }

      // Start polling for status updates
      if (bookingId) {
        startPolling(bookingId);
      }

      // Embed Snap
      window.snap.embed(snapToken, {
        embedId: "snap-container",
        onSuccess: function (result) {
          console.log("✅ Payment Success:", result);
          setPaymentStatus("success");
          setLoadingStatus("success");
          setLoadingMessage("Pembayaran berhasil!");

          setTimeout(() => {
            toast.success(
              "Pembayaran berhasil! Booking Anda telah dikonfirmasi.",
              {
                duration: 4000,
                icon: "✅",
              },
            );
            navigate("/my-bookings");
          }, 2000);
        },
        onPending: function (result) {
          console.log("⏳ Payment Pending:", result);
          setPaymentStatus("processing");

          toast(
            "Pembayaran sedang diproses. Kami akan mengkonfirmasi dalam beberapa saat.",
            {
              icon: "⏳",
              duration: 5000,
            },
          );

          setTimeout(() => {
            navigate("/my-bookings");
          }, 3000);
        },
        onError: function (result) {
          console.error("❌ Payment Error:", result);
          setPaymentStatus("failed");

          toast.error("Terjadi kesalahan saat memproses pembayaran.", {
            duration: 4000,
          });
        },
        onClose: function () {
          console.log("🚪 Payment window closed");

          toast(
            "Form pembayaran ditutup. Anda dapat melanjutkan pembayaran kapan saja.",
            {
              icon: "ℹ️",
              duration: 3000,
            },
          );

          // Give time for webhook to process
          setTimeout(() => {
            stopPolling();
            navigate("/my-bookings");
          }, 15000);
        },
      });

      console.log("✅ Snap embedded successfully");
    } catch (error) {
      console.error("❌ Error embedding Snap:", error);
      toast.error("Gagal memuat form pembayaran");
    }
  };

  // Polling untuk real-time status update
  const startPolling = (bookingId) => {
    stopPolling(); // Stop any existing polling

    pollingIntervalRef.current = setInterval(async () => {
      try {
        const { data } = await axios.get(`/api/bookings/${bookingId}`);

        if (data.success && data.booking) {
          const status = data.booking.paymentStatus;

          if (
            status === "paid" ||
            status === "success" ||
            status === "settlement"
          ) {
            setPaymentStatus("success");
            stopPolling();

            toast.success("✅ Pembayaran berhasil dikonfirmasi!");
            setTimeout(() => {
              navigate("/my-bookings");
            }, 2000);
          }
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    }, 3000); // Poll every 3 seconds
  };

  const stopPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  const handleGoBack = () => {
    if (window.confirm("Anda yakin ingin membatalkan pembayaran?")) {
      stopPolling();
      navigate(-1);
    }
  };

  if (isLoading || !bookingData) {
    return (
      <PaymentLoadingOverlay
        isVisible={true}
        status="processing"
        message="Memuat halaman pembayaran..."
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      {/* Loading Overlay */}
      <PaymentLoadingOverlay
        isVisible={
          paymentStatus === "processing" || paymentStatus === "success"
        }
        status={paymentStatus === "success" ? "success" : "verifying"}
        message={loadingMessage}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <FaArrowLeft />
            <span>Kembali</span>
          </button>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Halaman Pembayaran
                </h1>
                <p className="text-gray-600">
                  Selesaikan pembayaran untuk mengkonfirmasi booking Anda
                </p>
              </div>
              <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg">
                <FaLock className="text-xl" />
                <span className="font-semibold text-sm">Pembayaran Aman</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
              {/* Payment Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
                <h2 className="text-2xl font-bold mb-2">Metode Pembayaran</h2>
                <p className="text-blue-100 text-sm">
                  Pilih metode pembayaran yang Anda inginkan
                </p>
              </div>

              {/* Snap Container */}
              <div className="p-4">
                {!isScriptLoaded && (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-gray-600">Memuat sistem pembayaran...</p>
                  </div>
                )}

                <style>{`
                  #snap-container iframe {
                    border: none !important;
                    margin: 0 !important;
                    padding: 0 !important;
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

                <div
                  id="snap-container"
                  ref={snapContainerRef}
                  className="w-full"
                ></div>

                {/* Security Info */}
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <FaLock className="text-blue-600 text-xl flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm font-semibold text-blue-900 mb-1">
                        Keamanan Terjamin
                      </p>
                      <p className="text-xs text-blue-700 leading-relaxed">
                        Pembayaran Anda diproses melalui Midtrans dengan
                        enkripsi tingkat bank. Kami tidak menyimpan informasi
                        kartu kredit Anda.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment Methods Info */}
                <div className="mt-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Metode Pembayaran yang Diterima:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                      💳 Credit Card
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                      🏦 Bank Transfer
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                      🛒 E-Wallet
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                      🏪 Convenience Store
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Messages */}
            {paymentStatus === "success" && (
              <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <FaCheckCircle className="text-green-600 text-3xl flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-bold text-green-900 mb-2">
                      Pembayaran Berhasil!
                    </h3>
                    <p className="text-green-700 mb-3">
                      Booking Anda telah dikonfirmasi. Detail pemesanan telah
                      dikirim ke email Anda.
                    </p>
                    <p className="text-sm text-green-600">
                      Anda akan dialihkan ke halaman My Bookings...
                    </p>
                  </div>
                </div>
              </div>
            )}

            {paymentStatus === "failed" && (
              <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <FaExclamationTriangle className="text-red-600 text-3xl flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-bold text-red-900 mb-2">
                      Pembayaran Gagal
                    </h3>
                    <p className="text-red-700 mb-3">
                      Terjadi kesalahan saat memproses pembayaran Anda. Silakan
                      coba lagi.
                    </p>
                    <button
                      onClick={() => window.location.reload()}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                    >
                      Coba Lagi
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Booking Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <BookingSummary bookingData={bookingData} />
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              Butuh bantuan? Hubungi customer service kami
            </p>
            <p className="text-sm font-semibold text-blue-600">
              📞 +62 123-4567-890 | 📧 support@hotel.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomPaymentPage;
