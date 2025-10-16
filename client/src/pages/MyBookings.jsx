import React, { useEffect, useState } from "react";
import { FaLocationArrow } from "react-icons/fa";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

// ... (kode di atas tidak perlu diubah)
const MIDTRANS_SNAP_URL = "https://app.sandbox.midtrans.com/snap/snap.js";
const MIDTRANS_CLIENT_KEY = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;

const MyBookings = () => {
    // ... (semua fungsi handlePayment, handleCancel, fetchBookings, useEffect tidak perlu diubah)
    const { axios, user } = useAppContext();
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = MIDTRANS_SNAP_URL;
        script.setAttribute("data-client-key", MIDTRANS_CLIENT_KEY);
        script.async = true;
        document.body.appendChild(script);
        return () => {
        document.body.removeChild(script);
        };
    }, []);

    const fetchBookings = async () => {
        try {
        const { data } = await axios.get("/api/bookings/my-bookings");
        if (data.success) {
            setBookings(data.bookings);
        } else {
            toast.error(data.message);
        }
        } catch (error) {
        toast.error(error.response?.data?.message || "Gagal memuat booking.");
        }
    };

    const handlePayment = async (bookingId) => {
        try {
        const { data } = await axios.post("/api/bookings/pay", { bookingId });

        if (data.success && data.token) {
            window.snap.pay(data.token, {
            onSuccess: (result) => {
                toast.success("Pembayaran berhasil! Memperbarui status...");
                fetchBookings(); 
            },
            onPending: (result) => {
                toast("Pembayaran Anda sedang diproses.", { icon: "⏳" });
            },
            onError: (error) => {
                toast.error("Terjadi kesalahan saat pembayaran.");
            },
            });
        } else {
            toast.error(data.message || "Gagal memulai pembayaran.");
        }
        } catch (error) {
        toast.error(error.response?.data?.message || "Gagal memulai pembayaran.");
        }
    };

    const handleCancel = async (bookingId) => {
        if (window.confirm("Apakah Anda yakin ingin membatalkan booking ini?")) {
        try {
            const { data } = await axios.delete(`/api/bookings/${bookingId}`);
            if (data.success) {
            toast.success(data.message);
            setBookings(bookings.filter((booking) => booking._id !== bookingId));
            } else {
            toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Gagal membatalkan booking.");
        }
        }
    };

    useEffect(() => {
        if (user) {
        fetchBookings();
        }
    }, [user]);


    return (
        <div className="py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32">
            {/* ... (kode JSX Title dan Table Header tidak berubah) ... */}
            <div className="flex flex-col justify-center items-center text-center md:items-start md:text-left">
                <h1 className="text-4xl md:text-[40px] playfair">My Bookings</h1>
                <p className="text-sm md:text-base text-gray-500/90 mt-2 max-w-2xl outfit">
                Kelola reservasi hotel Anda yang lalu, sekarang, dan yang akan datang dengan mudah di satu tempat.
                </p>
            </div>
            <div className="max-w-6xl mt-10 w-full text-gray-800">
                <div className="hidden md:grid md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base py-3 outfit">
                    <div>Hotels</div>
                    <div>Tanggal & Durasi</div>
                    <div>Pembayaran</div>
                </div>

            {bookings.map((booking) => (
                <div key={booking._id} className="grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-200 py-6 first:border-t">
                    {/* ... (kode JSX Hotel Details dan Date & Timings tidak berubah) ... */}
                    <div className="flex gap-4">
                        <img src={booking.room.images[0]} alt="Hotel" className="w-32 h-24 rounded shadow object-cover"/>
                        <div className="flex flex-col justify-between">
                            <p className="playfair text-lg md:text-xl leading-snug">
                            {booking.hotel.name}
                            <span className="outfit text-sm font-normal ml-1">
                                ({booking.room.type})
                            </span>
                            </p>
                            <div className="flex items-center gap-2 text-sm text-gray-500 outfit">
                            <FaLocationArrow className="text-xs" />
                            <span>{booking.hotel.address}</span>
                            </div>
                            <p className="text-sm text-gray-500 outfit">
                            Tamu: <span className="font-medium">{booking.guests}</span>
                            </p>
                            <p className="text-base font-semibold outfit">
                            Total: Rp{booking.totalPrice.toLocaleString('id-ID')}
                            </p>
                        </div>
                    </div>
                    <div className="mt-4 md:mt-0 flex flex-col justify-center text-sm text-gray-600 outfit">
                        <p>
                            <strong>Check-in:</strong>{" "}
                            {new Date(booking.checkInDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                        <p>
                            <strong>Check-out:</strong>{" "}
                            {new Date(booking.checkOutDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>

                    {/* Payment Status */}
                    <div className="mt-4 md:mt-0 flex flex-col gap-2 items-center justify-start md:justify-center outfit">
                        <span
                            className={`text-sm font-medium px-3 py-1.5 rounded-full ${
                                booking.paymentStatus === 'paid' ? "bg-green-100 text-green-700"
                                : booking.paymentStatus === 'cancelled' ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                        >
                            {booking.paymentStatus === 'paid' ? "Lunas" : booking.paymentStatus === 'cancelled' ? "Dibatalkan" : "Pending"}
                        </span>

                        {/* ✅ PERUBAHAN DI SINI: Tombol hanya muncul jika statusnya 'pending' */}
                        {booking.paymentStatus === 'pending' && (
                            <div className="flex flex-col gap-2 w-full max-w-[120px] mt-2">
                                <button onClick={() => handlePayment(booking._id)} className="w-full px-3 py-1.5 rounded-full bg-gray-800 text-white outfit text-xs cursor-pointer hover:bg-black">
                                    Bayar Sekarang
                                </button>
                                <button onClick={() => handleCancel(booking._id)} className="w-full px-3 py-1.5 rounded-full bg-red-100 text-red-700 outfit text-xs cursor-pointer hover:bg-red-200">
                                    Batalkan
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ))}
            </div>
        </div>
    );
};

export default MyBookings;