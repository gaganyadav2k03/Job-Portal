import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

// USER AUTH ROUTES
router.post("/register", upload.single("profileImage"), register);
router.post("/login", login);

// router.post(
//   "/register",
//   upload.fields([
//     { name: "resume", maxCount: 1 },
//     { name: "profilePic", maxCount: 1 },
//   ]),
//   registerUser
// );

export default router;
