import express from "express";
import {
  createBooking,
  getUserBookings,
  getAllBookings,
  getBookingById,
  assignTechnician,
  updateBookingStatus,
  addWorkNote,
  addAdditionalCost,
  cancelBooking,
  initiatePayment,
  getBookingStatistics,
} from "../controllers/bookingController.js";

const router = express.Router();

// ===== ADMIN ROUTES =====
router.get("/", getAllBookings); // Get all bookings (admin)
router.get("/statistics/dashboard", getBookingStatistics); // Get booking statistics
router.post("/:id/assign-technician", assignTechnician); // Assign technician to booking
router.patch("/:id/status", updateBookingStatus); // Update booking status
router.post("/:id/work-notes", addWorkNote); // Add work note
router.post("/:id/additional-cost", addAdditionalCost); // Add additional cost

// ===== USER ROUTES =====
router.post("/", createBooking); // Create new booking
router.get("/my-bookings", getUserBookings); // Get user's bookings
router.get("/:id", getBookingById); // Get booking by ID
router.post("/:id/cancel", cancelBooking); // Cancel booking

// ===== PAYMENT ROUTES =====
router.post("/:id/payment", initiatePayment); // Initiate payment with Midtrans

export default router;
