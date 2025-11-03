import express from "express";
import {
  checkAvailabilityAPI,
  createBookingAndPay,
  getUserBookings,
  midtransRetryPayment,
  cancelBooking,
  getHotelBookings,
} from "../controllers/bookingController.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

// --------------------------------------------------
// 🔗 Definisi Rute untuk Booking
// --------------------------------------------------

// Rute untuk cek ketersediaan (tidak perlu login)
router.post("/check-availability", checkAvailabilityAPI);

// Rute untuk membuat booking baru dan langsung memicu pembayaran
router.post("/book", protectedRoute, createBookingAndPay);

// Rute untuk melihat semua booking milik pengguna
router.get("/my-bookings", protectedRoute, getUserBookings);

// Rute ini khusus untuk menangani tombol "Bayar Sekarang"
router.post("/pay", protectedRoute, midtransRetryPayment);

// Rute ini khusus untuk menangani tombol "Batalkan"
// Menggunakan metode DELETE dan mengambil bookingId dari parameter URL
router.delete("/:bookingId", protectedRoute, cancelBooking);

// Rute untuk admin dashboard - get all bookings for admin's hotel
router.get("/hotel", protectedRoute, getHotelBookings);

export default router;
