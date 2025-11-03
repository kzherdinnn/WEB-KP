import express from "express";
const userRouter = express.Router();
import {
  getUserData,
  storeRecentSearchedCities,
  getAllUsers,
  createUser,
  updateUserRole,
  deleteUser,
} from "../controllers/userController.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";

// User routes
userRouter.get("/", protectedRoute, getUserData);
userRouter.post(
  "/store-recent-search",
  protectedRoute,
  storeRecentSearchedCities,
);

// Admin user management routes
userRouter.get("/admin/all", protectedRoute, getAllUsers);
userRouter.post("/admin/create", protectedRoute, createUser);
userRouter.put("/admin/:userId/role", protectedRoute, updateUserRole);
userRouter.delete("/admin/:userId", protectedRoute, deleteUser);

export default userRouter;
