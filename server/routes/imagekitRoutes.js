import express from "express";
import { getAuth } from "../controllers/imagekitController.js";

const router = express.Router();

// GET /api/imagekit/auth
router.get("/auth", getAuth);

export default router;
