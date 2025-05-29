import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import {
  getProfile,
  updateProfile,
} from "../controllers/profile.controller.js";

const router = express.Router();

// PROFILE ROUTES
router.get("/", verifyToken, getProfile); // Get logged-in user's profile
router.put("/", verifyToken, updateProfile); // Update profile

export default router;
