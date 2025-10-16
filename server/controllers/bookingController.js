import bookingModel from "../models/booking.models.js";
import roomModel from "../models/room.models.js";
import midtransClient from "midtrans-client";
import mongoose from 'mongoose';

// --------------------------------------------------
// 🔹 Inisialisasi Midtrans Snap Client
// --------------------------------------------------
const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

// --------------------------------------------------
// 헬 Helper Function: Cek Ketersediaan Kamar
// --------------------------------------------------
const checkAvailability = async ({ checkInDate, checkOutDate, room }) => {
  const bookings = await bookingModel.find({
    room,
    checkInDate: { $lte: checkOutDate },
    checkOutDate: { $gte: checkInDate },
    paymentStatus: 'paid'
  });
  return bookings.length === 0;
};

// --------------------------------------------------
// ✅ API: Endpoint untuk Cek Ketersediaan
// --------------------------------------------------
export const checkAvailabilityAPI = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate } = req.body;
    const isAvailable = await checkAvailability({ room, checkInDate, checkOutDate });
    res.json({ success: true, isAvailable });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// -----------------------------------------------------------------
// 💳 FUNGSI UTAMA: Buat Booking Baru & Inisiasi Pembayaran Midtrans
// -----------------------------------------------------------------
export const createBookingAndPay = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate, guests } = req.body;
    const user = req.user;

    const isAvailable = await checkAvailability({ room, checkInDate, checkOutDate });
    if (!isAvailable) {
      return res.status(400).json({ success: false, message: "Kamar tidak tersedia pada tanggal yang dipilih." });
    }

    const roomData = await roomModel.findById(room).populate("hotel");
    if (!roomData) {
      return res.status(404).json({ success: false, message: "Kamar tidak ditemukan." });
    }

    const nights = Math.ceil((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 3600 * 24));
    const totalPrice = roomData.pricePerNight * nights;

    const newBooking = await bookingModel.create({
      _id: new mongoose.Types.ObjectId(),
      user: user._id,
      room,
      hotel: roomData.hotel._id,
      checkInDate,
      checkOutDate,
      totalPrice,
      guests: +guests,
      paymentStatus: 'pending'
    });

    const parameter = {
      transaction_details: {
        order_id: newBooking._id.toString(),
        gross_amount: totalPrice,
      },
      customer_details: {
        first_name: user.username,
        email: user.email,
      },
      item_details: [{
        id: roomData._id,
        price: roomData.pricePerNight,
        quantity: nights,
        name: `Booking ${roomData.type} at ${roomData.hotel.name}`,
      }],
      // ✅ TAMBAHKAN BLOK INI: Beri tahu Midtrans alamat kembali
      callbacks: {
        finish: `${process.env.FRONTEND_URL}/my-bookings`
      }
    };

    const transaction = await snap.createTransaction(parameter);

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

// --------------------------------------------------
// 📚 API: Get Semua Booking Milik User
// --------------------------------------------------
export const getUserBookings = async (req, res) => {
  try {
    const userId = req.auth?.userId;
    const bookings = await bookingModel
      .find({ user: userId })
      .populate({ 
          path: 'room', 
          populate: { 
              path: 'hotel' 
          } 
      })
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --------------------------------------------------
// 🔄 API: Untuk Tombol "Bayar Sekarang" (Retry Payment)
// --------------------------------------------------
export const midtransRetryPayment = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const user = req.user;

    const booking = await bookingModel.findById(bookingId).populate({ path: 'room', populate: { path: 'hotel' } });
    
    if (!booking || !booking.room || !booking.room.hotel) {
      return res.status(404).json({ success: false, message: "Detail booking tidak ditemukan." });
    }
    if (booking.user.toString() !== user._id.toString()) {
      return res.status(403).json({ success: false, message: "Akses ditolak." });
    }
    if (booking.paymentStatus === 'paid') {
      return res.status(400).json({ success: false, message: "Booking ini sudah lunas." });
    }

    const nights = (new Date(booking.checkOutDate).getTime() - new Date(booking.checkInDate).getTime()) / (1000 * 3600 * 24);

    const parameter = {
      transaction_details: {
        order_id: booking._id.toString(),
        gross_amount: booking.totalPrice,
      },
      customer_details: {
        first_name: user.username,
        email: user.email,
      },
      item_details: [{
        id: booking.room._id,
        price: booking.room.pricePerNight,
        quantity: nights,
        name: `Booking ${booking.room.type} at ${booking.room.hotel.name}`,
      }],
      // ✅ TAMBAHKAN BLOK INI JUGA: Beri tahu Midtrans alamat kembali
      callbacks: {
        finish: `${process.env.FRONTEND_URL}/my-bookings`
      }
    };

    const transaction = await snap.createTransaction(parameter);

    res.status(200).json({
      success: true,
      token: transaction.token,
    });
  } catch (error) {
    console.error("🔥 Error saat mencoba ulang pembayaran Midtrans:", error);
    res.status(500).json({ success: false, message: "Gagal memulai pembayaran." });
  }
};

// --------------------------------------------------
// ❌ API: Untuk Membatalkan Booking
// --------------------------------------------------
export const cancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const user = req.user;
        const booking = await bookingModel.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking tidak ditemukan." });
        }
        if (booking.user.toString() !== user._id.toString()) {
            return res.status(403).json({ success: false, message: "Akses ditolak." });
        }
        if (booking.paymentStatus !== 'pending') {
            return res.status(400).json({ success: false, message: "Hanya booking yang belum dibayar yang bisa dibatalkan." });
        }
        await bookingModel.findByIdAndDelete(bookingId);
        res.status(200).json({ success: true, message: "Booking berhasil dibatalkan." });
    } catch (error) {
        console.error("🔥 Error saat membatalkan booking:", error);
        res.status(500).json({ success: false, message: "Gagal membatalkan booking." });
    }
};