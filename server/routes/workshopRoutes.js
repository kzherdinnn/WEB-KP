import express from "express";
import {
  getWorkshopInfo,
  updateWorkshopInfo,
  getAvailableTimeSlots,
} from "../controllers/workshopController.js";

const router = express.Router();

// ===== PUBLIC ROUTES =====
router.get("/", getWorkshopInfo); // Get workshop information
router.get("/timeslots", getAvailableTimeSlots); // Get available time slots for a date

// ===== ADMIN ROUTES =====
router.put("/", updateWorkshopInfo); // Update workshop info

export default router;
