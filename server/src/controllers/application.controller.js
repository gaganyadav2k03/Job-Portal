import fs from "fs";
import path from "path";
import { Application } from "../models/Application.js";
import { Job } from "../models/Job.js";

export const applyForJob = async (req, res) => {
  try {
    const { coverLetter } = req.body;
    const resume = req.file;
    const jobId = req.params.id;
    const applicantId = req.user._id;

    // console.log("file: ", req.file);

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Prevent duplicate applications
    const alreadyApplied = await Application.findOne({ jobId, applicantId });
    if (alreadyApplied) {
      return res
        .status(400)
        .json({ success: false, message: "Already applied to this job" });
    }

    // Make sure resume is provided (you can check file type or size too)
    if (!resume) {
      return res
        .status(400)
        .json({ success: false, message: "Resume is required" });
    }

    const application = await Application.create({
      jobId,
      applicantId,
      resume: resume.filename, // resume url
      coverLetter,
    });

    // Add the applicant to the job's applicants field
    job.applicants.push({
      user: applicantId,
    });

    // Save the updated job document
    await job.save();

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    console.error("Apply Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Controller for getting all applications of an applicant(jobseeker)
export const getMyApplications = async (req, res) => {
  try {
    const applicantId = req.user._id;

    const applications = await Application.find({ applicantId })
      .populate("jobId", "jobTitle companyName location") // Populate job details
      .sort({ createdAt: -1 }) // Sort by the most recent application
      .lean();

    // console.log("applied application: ", applications);

    res.status(200).json({ success: true, applications });
  } catch (error) {
    console.error("Fetch Applications Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get applicants for a specific job (Employer view)

export const getApplicantsByJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const applications = await Application.find({ jobId })
      .populate("applicantId", "firstName lastName email contactNumber resume") // Add resume field here
      .sort({ createdAt: -1 })
      .lean();

    // Count total applicants for the given job
    const totalApplicants = await Application.countDocuments({ jobId });

    // Format the appliedAt date
    applications.forEach((applicant) => {
      applicant.appliedAt = new Date(applicant.createdAt).toLocaleDateString(); // Format the appliedAt date
    });

    res
      .status(200)
      .json({ success: true, applicant: totalApplicants, applications });
  } catch (error) {
    console.error("Fetch Applicants Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update application status (Admin/Employer action)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await Application.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }

    res.status(200).json({ success: true, updated });
  } catch (error) {
    console.error("Status Update Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//download resume controller

export const downloadResume = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const currentUserId = req.user.id;
    const currentUserRole = req.user.accountType;

    // 1. Find the application
    const application = await Application.findById(applicationId);
    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }

    // 2. Find the job
    const job = await Job.findById(application.jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // 3. Authorization check
    if (
      job.postedBy.toString() !== currentUserId.toString() ||
      currentUserRole !== "employer"
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to download this resume",
      });
    }

    // 4. Resolve resume path
    const resumeDirectory = path.join(process.cwd(), "uploads", "resumes");
    const resumePath = path.join(resumeDirectory, application.resume);

    // 5. Check if the file exists
    if (!fs.existsSync(resumePath)) {
      return res
        .status(404)
        .json({ success: false, message: "Resume file not found" });
    }

    // 6. Set explicit headers
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${application.resume}"`
    );
    res.setHeader("Content-Type", "application/pdf");

    // 7. Send file
    res.download(resumePath, (err) => {
      if (err) {
        console.error("Error sending file:", err);
        res
          .status(500)
          .json({ success: false, message: "Failed to download resume" });
      }
    });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
