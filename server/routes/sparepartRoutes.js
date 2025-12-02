import express from "express";
import {
  getAllSpareparts,
  getSparepartById,
  createSparepart,
  updateSparepart,
  deleteSparepart,
  checkStockStatus,
  updateStock,
  checkCompatibility,
} from "../controllers/sparepartController.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

// ===== PUBLIC ROUTES =====
router.get("/", getAllSpareparts); // Get all spareparts with filters
router.get("/:id", getSparepartById); // Get sparepart by ID
router.get("/:id/stock", checkStockStatus); // Check stock status
router.get("/:id/compatibility", checkCompatibility); // Check vehicle compatibility

// ===== ADMIN ROUTES (implement middleware later) =====
router.post("/", upload.array("images", 5), createSparepart); // Create new sparepart
router.put("/:id", upload.array("images", 5), updateSparepart); // Update sparepart
router.delete("/:id", deleteSparepart); // Delete sparepart
router.patch("/:id/stock", updateStock); // Update stock

export default router;
