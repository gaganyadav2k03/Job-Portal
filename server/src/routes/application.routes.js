import express from "express";
import {
  applyForJob,
  getMyApplications,
  getApplicantsByJob,
  downloadResume,
} from "../controllers/application.controller.js";
import { verifyToken, authorizeRoles } from "../middlewares/auth.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

// JOBSEEKER: Apply for a job
router.post(
  "/apply/:id",
  verifyToken,
  authorizeRoles("jobSeeker"),
  upload.single("resume"),
  applyForJob
);

// JOBSEEKER: See all applications made
router.get(
  "/my-applications",
  verifyToken,
  authorizeRoles("jobSeeker"),
  getMyApplications
);

// EMPLOYER: View applicants for a specific job
router.get(
  "/job/:jobId/applicants",
  verifyToken,
  authorizeRoles("employer"),
  getApplicantsByJob
);

// Only authenticated users can request download
router.get("/download/:applicationId", verifyToken, downloadResume);

export default router;
