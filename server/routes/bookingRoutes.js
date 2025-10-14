import express from 'express';
import { checkAvailabilityAPI, createBookingAndPay, getUserBookings } from '../controllers/bookingController.js';
import { protectedRoute } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Rute untuk cek ketersediaan (tidak perlu login)
router.post('/check-availability', checkAvailabilityAPI);

// ✅ PERUBAHAN: Rute `/book` sekarang dilindungi dan memanggil fungsi pembayaran
router.post('/book', protectedRoute, createBookingAndPay);

// Rute untuk melihat booking pengguna (perlu login)
router.get('/my-bookings', protectedRoute, getUserBookings);

export default router;