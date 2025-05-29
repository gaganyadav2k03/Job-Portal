import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const verifyToken = async (req, res, next) => {
  try {
    // Extract token
    const token =
      req.cookies?.token ||
      req.body?.token ||
      req.header("Authorization")?.replace("Bearer ", "") ||
      req.query?.token; // allow token in query params

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Token missing",
      });
    }

    // 2. Verify token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // console.log("decoded user: ", decoded);

      // 3. Find user and attach to request
      const user = await User.findById(decoded.id).populate(
        "additionalDetails"
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("Error decoding token: ", error);
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid token",
        error: error.message,
      });
    }

    // if (!decoded || !decoded.id) {
    //   return res.status(401).json({
    //     success: false,
    //     message: "Unauthorized: Invalid token",
    //   });
    // }
  } catch (error) {
    console.error("verifyToken middleware error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      error: error.message,
    });
  }
};

// Middleware Allow roles
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.accountType;

    // Check if user's role is in allowedRoles
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Only ${allowedRoles.join(" or ")} allowed.`,
      });
    }

    next();
  };
};
