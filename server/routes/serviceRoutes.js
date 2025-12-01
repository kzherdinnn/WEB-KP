import express from "express";
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from "../controllers/serviceController.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

// ===== PUBLIC ROUTES =====
router.get("/", getAllServices); // Get all services with filters
router.get("/:id", getServiceById); // Get service by ID

// ===== ADMIN ROUTES =====
router.post("/", upload.array("images", 5), createService); // Create new service
router.put("/:id", upload.array("images", 5), updateService); // Update service
router.delete("/:id", deleteService); // Delete service

export default router;
