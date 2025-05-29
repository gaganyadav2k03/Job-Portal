import express from "express";
import {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  searchJobs,
  getEmployerJob,
} from "../controllers/job.controller.js";
import { verifyToken, authorizeRoles } from "../middlewares/auth.js";

const router = express.Router();

// Protected: Only employers can create, update, delete
router.post("/create", verifyToken, authorizeRoles("employer"), createJob);
router.put("/:id", verifyToken, authorizeRoles("employer"), updateJob);
router.delete("/:id", verifyToken, authorizeRoles("employer"), deleteJob);
router.get("/my-jobs", verifyToken, authorizeRoles("employer"), getEmployerJob);

// Public: All users can view jobs
router.get("/", getAllJobs);
router.get("/:id", getJobById);
router.get("/search", searchJobs);

export default router;
