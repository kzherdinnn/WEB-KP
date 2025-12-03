import express from "express";
import {
  getAllArticles,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle,
  getArticleById,
} from "../controllers/articleController.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

// ===== PUBLIC ROUTES =====
router.get("/", getAllArticles);
router.get("/detail/:id", getArticleById); // Specific path to avoid conflict with slug
router.get("/:slug", getArticleBySlug);

// ===== ADMIN ROUTES =====
router.post("/", upload.single("image"), createArticle);
router.put("/:id", upload.single("image"), updateArticle);
router.delete("/:id", deleteArticle);

export default router;
