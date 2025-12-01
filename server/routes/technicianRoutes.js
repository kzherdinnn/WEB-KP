import express from "express";
import {
  getAllTechnicians,
  getTechnicianById,
  createTechnician,
  updateTechnician,
  deleteTechnician,
  getAvailableTechnicians,
} from "../controllers/technicianController.js";

const router = express.Router();

// ===== PUBLIC ROUTES =====
router.get("/", getAllTechnicians); // Get all technicians
router.get("/available", getAvailableTechnicians); // Get available technicians for specific date/time
router.get("/:id", getTechnicianById); // Get technician by ID

// ===== ADMIN ROUTES =====
router.post("/", createTechnician); // Create new technician
router.put("/:id", updateTechnician); // Update technician
router.delete("/:id", deleteTechnician); // Delete technician

export default router;
