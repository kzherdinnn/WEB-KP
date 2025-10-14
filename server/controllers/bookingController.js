import bookingModel from "../models/booking.models.js";
import roomModel from "../models/room.models.js";
import midtransClient from "midtrans-client";
import mongoose from 'mongoose';

// 🔹 Inisialisasi Midtrans Snap client
const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

// Helper function untuk cek ketersediaan
const checkAvailability = async ({ checkInDate, checkOutDate, room }) => {
  const bookings = await bookingModel.find({
    room,
    checkInDate: { $lte: checkOutDate },
    checkOutDate: { $gte: checkInDate },
    paymentStatus: 'paid' // Hanya periksa booking yang sudah lunas
  });
  return bookings.length === 0;
};

// ===================================================
// ✅ API untuk cek ketersediaan (Tidak Berubah)
// ===================================================
export const checkAvailabilityAPI = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate } = req.body;
    const isAvailable = await checkAvailability({ room, checkInDate, checkOutDate });
    res.json({ success: true, isAvailable });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =================================================================
// 💳 FUNGSI UTAMA BARU: Buat Booking & Transaksi Midtrans
// =================================================================
export const createBookingAndPay = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate, guests } = req.body;
    const user = req.user; // Dapatkan data lengkap user dari middleware protectedRoute

    const isAvailable = await checkAvailability({ room, checkInDate, checkOutDate });
    if (!isAvailable) {
      return res.status(400).json({ success: false, message: "Kamar tidak tersedia pada tanggal yang dipilih." });
    }

    const roomData = await roomModel.findById(room).populate("hotel");
    if (!roomData) {
      return res.status(404).json({ success: false, message: "Kamar tidak ditemukan." });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
    const totalPrice = roomData.pricePerNight * nights;

    // 1. Buat booking baru di database dengan status 'pending'
    const newBooking = await bookingModel.create({
      _id: new mongoose.Types.ObjectId(), // Buat ID baru yang unik untuk booking
      user: user._id,
      room,
      hotel: roomData.hotel._id,
      checkInDate,
      checkOutDate,
      totalPrice,
      guests: +guests,
      paymentStatus: 'pending' // Status awal adalah pending
    });

    // 2. Siapkan parameter untuk Midtrans
    const parameter = {
      transaction_details: {
        order_id: newBooking._id.toString(), // Gunakan ID booking sebagai order_id unik
        gross_amount: totalPrice,
      },
      customer_details: {
        // Ambil data dari user yang sudah login
        first_name: user.username,
        email: user.email,
      },
      item_details: [{
        id: roomData._id,
        price: roomData.pricePerNight,
        quantity: nights,
        name: `Booking ${roomData.type} at ${roomData.hotel.name}`,
      }],
    };

    // 3. Buat transaksi di Midtrans untuk mendapatkan token
    const transaction = await snap.createTransaction(parameter);

    // 4. Kirim token pembayaran kembali ke frontend
    res.status(201).json({
      success: true,
      message: "Transaksi Midtrans berhasil dibuat.",
      token: transaction.token,
    });

  } catch (error) {
    console.error("🔥 Error saat membuat transaksi Midtrans:", error);
    res.status(500).json({ success: false, message: "Gagal membuat transaksi pembayaran." });
  }
};

// ===================================================
// ✅ API untuk get semua booking user (Tidak Berubah)
// ===================================================
export const getUserBookings = async (req, res) => {
  try {
    const userId = req.auth?.userId;
    const bookings = await bookingModel
      .find({ user: userId })
      .populate("room hotel")
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};