import bookingModel from "../models/booking.models.js";
import roomModel from "../models/room.models.js";
import hotelModel from "../models/hotel.models.js";
import userModel from "../models/user.models.js";
import midtransClient from "midtrans-client";
import mongoose from "mongoose";

// --------------------------------------------------
// 🔹 Inisialisasi Midtrans Snap Client
// --------------------------------------------------
const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

// --------------------------------------------------
// 헬 Helper Function: Cek Ketersediaan Kamar Berdasarkan Kapasitas
// --------------------------------------------------
const checkAvailability = async ({ checkInDate, checkOutDate, room }) => {
  // Cek room data untuk kapasitas
  const roomData = await roomModel.findById(room);
  if (!roomData) {
    return { available: false, message: "Kamar tidak ditemukan." };
  }

  // Cek apakah masih ada available rooms
  if (roomData.availableRooms <= 0) {
    return {
      available: false,
      message: "Kamar sudah penuh. Tidak ada kamar tersedia.",
    };
  }

  // Cek booking yang overlap dengan tanggal yang diminta
  const overlappingBookings = await bookingModel.countDocuments({
    room,
    checkInDate: { $lte: checkOutDate },
    checkOutDate: { $gte: checkInDate },
    paymentStatus: "paid",
  });

  // Bandingkan jumlah booking dengan total rooms
  const isAvailable = overlappingBookings < roomData.totalRooms;

  return {
    available: isAvailable,
    message: isAvailable
      ? `Tersedia ${roomData.availableRooms} kamar`
      : "Kamar tidak tersedia pada tanggal yang dipilih.",
    availableRooms: roomData.availableRooms,
    totalRooms: roomData.totalRooms,
  };
};

// --------------------------------------------------
// ✅ API: Endpoint untuk Cek Ketersediaan
// --------------------------------------------------
export const checkAvailabilityAPI = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate } = req.body;
    const availabilityCheck = await checkAvailability({
      room,
      checkInDate,
      checkOutDate,
    });
    res.json({ success: true, ...availabilityCheck });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// -----------------------------------------------------------------
// 💳 FUNGSI UTAMA: Buat Booking Baru & Inisiasi Pembayaran Midtrans
// -----------------------------------------------------------------
export const createBookingAndPay = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate, guests, numberOfRooms } = req.body;
    const user = req.user;

    // Validasi numberOfRooms
    const roomsToBook = parseInt(numberOfRooms) || 1;
    if (roomsToBook < 1) {
      return res.status(400).json({
        success: false,
        message: "Jumlah kamar harus minimal 1.",
      });
    }

    // Cek ketersediaan dengan sistem kapasitas baru
    const availabilityCheck = await checkAvailability({
      room,
      checkInDate,
      checkOutDate,
    });

    if (!availabilityCheck.available) {
      return res.status(400).json({
        success: false,
        message: availabilityCheck.message,
      });
    }

    const roomData = await roomModel.findById(room).populate("hotel");
    if (!roomData) {
      return res
        .status(404)
        .json({ success: false, message: "Kamar tidak ditemukan." });
    }

    // Double check availableRooms - cek apakah cukup untuk jumlah yang dipesan
    if (roomData.availableRooms < roomsToBook) {
      return res.status(400).json({
        success: false,
        message: `Maaf, hanya tersedia ${roomData.availableRooms} kamar. Anda memesan ${roomsToBook} kamar.`,
      });
    }

    const nights = Math.ceil(
      (new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) /
        (1000 * 3600 * 24),
    );
    // Hitung total price: pricePerNight × nights × numberOfRooms
    const totalPrice = roomData.pricePerNight * nights * roomsToBook;

    const newBooking = await bookingModel.create({
      _id: new mongoose.Types.ObjectId(),
      user: user._id,
      room,
      hotel: roomData.hotel._id,
      checkInDate,
      checkOutDate,
      totalPrice,
      guests: +guests,
      numberOfRooms: roomsToBook,
      paymentStatus: "pending",
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
      item_details: [
        {
          id: roomData._id,
          price: roomData.pricePerNight * roomsToBook,
          quantity: nights,
          name: `Booking ${roomsToBook} × ${roomData.type} at ${roomData.hotel.name}`,
        },
      ],
      // ✅ TAMBAHKAN BLOK INI: Beri tahu Midtrans alamat kembali
      callbacks: {
        finish: `${process.env.FRONTEND_URL}/my-bookings`,
      },
    };

    const transaction = await snap.createTransaction(parameter);

    // ⚠️ PENTING: Kurangi availableRooms sesuai jumlah yang dipesan
    roomData.availableRooms -= roomsToBook;
    await roomData.save();

    res.status(201).json({
      success: true,
      message: "Transaksi Midtrans berhasil dibuat.",
      token: transaction.token,
      bookingId: newBooking._id,
      availableRooms: roomData.availableRooms,
    });
  } catch (error) {
    console.error("🔥 Error saat membuat transaksi Midtrans:", error);
    res
      .status(500)
      .json({ success: false, message: "Gagal membuat transaksi pembayaran." });
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
        path: "room",
        populate: {
          path: "hotel",
        },
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

    const booking = await bookingModel
      .findById(bookingId)
      .populate({ path: "room", populate: { path: "hotel" } });

    if (!booking || !booking.room || !booking.room.hotel) {
      return res
        .status(404)
        .json({ success: false, message: "Detail booking tidak ditemukan." });
    }
    if (booking.user.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Akses ditolak." });
    }
    if (booking.paymentStatus === "paid") {
      return res
        .status(400)
        .json({ success: false, message: "Booking ini sudah lunas." });
    }

    const nights =
      (new Date(booking.checkOutDate).getTime() -
        new Date(booking.checkInDate).getTime()) /
      (1000 * 3600 * 24);

    const roomsBooked = booking.numberOfRooms || 1;

    const parameter = {
      transaction_details: {
        order_id: booking._id.toString(),
        gross_amount: booking.totalPrice,
      },
      customer_details: {
        first_name: user.username,
        email: user.email,
      },
      item_details: [
        {
          id: booking.room._id,
          price: booking.room.pricePerNight * roomsBooked,
          quantity: nights,
          name: `Booking ${roomsBooked} × ${booking.room.type} at ${booking.room.hotel.name}`,
        },
      ],
      // ✅ TAMBAHKAN BLOK INI JUGA: Beri tahu Midtrans alamat kembali
      callbacks: {
        finish: `${process.env.FRONTEND_URL}/my-bookings`,
      },
    };

    const transaction = await snap.createTransaction(parameter);

    res.status(200).json({
      success: true,
      token: transaction.token,
    });
  } catch (error) {
    console.error("🔥 Error saat mencoba ulang pembayaran Midtrans:", error);
    res
      .status(500)
      .json({ success: false, message: "Gagal memulai pembayaran." });
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
      return res
        .status(404)
        .json({ success: false, message: "Booking tidak ditemukan." });
    }
    if (booking.user.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Akses ditolak." });
    }
    if (booking.paymentStatus !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Hanya booking yang belum dibayar yang bisa dibatalkan.",
      });
    }

    // Kembalikan availableRooms ketika booking dibatalkan
    const roomData = await roomModel.findById(booking.room);
    if (roomData) {
      const roomsToRestore = booking.numberOfRooms || 1;
      roomData.availableRooms = Math.min(
        roomData.availableRooms + roomsToRestore,
        roomData.totalRooms,
      );
      await roomData.save();
    }

    await bookingModel.findByIdAndDelete(bookingId);
    res
      .status(200)
      .json({ success: true, message: "Booking berhasil dibatalkan." });
  } catch (error) {
    console.error("🔥 Error saat membatalkan booking:", error);
    res
      .status(500)
      .json({ success: false, message: "Gagal membatalkan booking." });
  }
};

// --------------------------------------------------
// 📊 API: Get Hotel Bookings untuk Admin Dashboard
// --------------------------------------------------
export const getHotelBookings = async (req, res) => {
  try {
    const userId = req.user._id;

    // Cek apakah user adalah admin
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Akses ditolak. Hanya admin." });
    }

    // Cari hotel yang dimiliki admin ini
    const hotel = await hotelModel.findOne({ admin: userId });
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message:
          "Hotel tidak ditemukan. Silakan register hotel terlebih dahulu.",
      });
    }

    // Cari semua room yang dimiliki hotel ini
    const rooms = await roomModel.find({ hotel: hotel._id });
    const roomIds = rooms.map((room) => room._id.toString());

    // Cari semua booking untuk room-room tersebut
    const bookings = await bookingModel
      .find({ room: { $in: roomIds } })
      .populate({
        path: "room",
        populate: {
          path: "hotel",
        },
      })
      .sort({ createdAt: -1 });

    // Ambil user data untuk setiap booking (karena user field adalah string, bukan ObjectId)
    const userIds = [...new Set(bookings.map((b) => b.user))];
    const users = await userModel.find({ _id: { $in: userIds } });
    const userMap = {};
    users.forEach((user) => {
      userMap[user._id] = user;
    });

    // Tambahkan user data ke setiap booking
    const bookingsWithUser = bookings.map((booking) => {
      const bookingObj = booking.toObject();
      bookingObj.user = userMap[booking.user] || {
        _id: booking.user,
        username: "Unknown User",
        email: "N/A",
      };
      return bookingObj;
    });

    // Hitung statistik
    const totalBookings = bookings.length;
    const totalRevenue = bookings
      .filter((booking) => booking.paymentStatus === "paid")
      .reduce((sum, booking) => sum + booking.totalPrice, 0);

    res.json({
      success: true,
      bookings: bookingsWithUser,
      totalBookings,
      totalRevenue,
      hotel: {
        name: hotel.name,
        totalRooms: rooms.length,
      },
    });
  } catch (error) {
    console.error("🔥 Error saat mengambil data dashboard:", error);
    res
      .status(500)
      .json({ success: false, message: "Gagal mengambil data dashboard." });
  }
};
