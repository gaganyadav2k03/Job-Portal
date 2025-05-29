import { Job } from "../models/Job.js";
import mongoose from "mongoose";

export const createJob = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      jobTitle,
      jobDescription,
      companyName,
      location,
      jobType,
      salaryRange,
      skillRequired,
      experienceRequired,
    } = req.body;

    if (!jobTitle || !jobDescription || !companyName || !location) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const newJob = await Job.create({
      jobTitle,
      jobDescription,
      companyName,
      location,
      jobType,
      salaryRange,
      skillRequired,
      experienceRequired,
      postedBy: userId,
      postedDate: Date.now(),
    });

    return res.status(200).json({
      success: true,
      data: newJob,
      message: "Job created successfully",
    });
  } catch (error) {
    console.error("Error creating job: ", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create job",
      error: error.message,
    });
  }
};

// GET all jobs with filters, search, pagination, sorting
export const getAllJobs = async (req, res) => {
  try {
    // Get query params
    const {
      search = "",
      location,
      jobType,
      experienceRequired,
      salaryRange,
      company,
      skills,
      page = 1,
      limit = 10,
      sort = "-createdAt",
    } = req.query;

    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    // Build a filter object dynamically
    const filter = {};

    if (search) {
      const searchRegex = { $regex: search, $options: "i" };
      filter.$or = [
        { jobTitle: searchRegex },
        { description: searchRegex },
        { companyName: searchRegex },
        { location: searchRegex },
        { jobType: searchRegex },
        { experienceRequired: searchRegex },
        { skills: searchRegex },
      ];
    }

    if (location) filter.location = { $regex: location, $options: "i" };
    if (jobType) filter.jobType = { $regex: jobType, $options: "i" };
    if (experienceRequired)
      filter.experienceRequired = { $regex: experienceRequired, $options: "i" };
    if (company) filter.companyName = { $regex: company, $options: "i" };
    if (skills) {
      const skillArray = skills.split(",");
      filter.skillRequired = { $in: skillArray };
    }

    if (salaryRange) {
      filter.salaryRange = { $gte: Number(salaryRange) };
    }

    // Fetch filtered jobs from DB
    // const jobs = await Job.find(filters).sort({ createdAt: -1 });

    const jobs = await Job.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNumber);

    const total = await Job.countDocuments(filter);
    const totalPages = Math.ceil(total / limitNumber);

    res.status(200).json({
      success: true,
      totalJobs: total,
      totalPages,
      page: pageNumber,
      jobs,
    });
  } catch (error) {
    console.error("Error fetching jobs: ", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
      error: error.message,
    });
  }
};

export const getJobById = async (req, res) => {
  try {
    const { id: jobId } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID format",
      });
    }

    // Find job by ID and populate postedBy field
    const job = await Job.findById(jobId).populate(
      "postedBy",
      "firstName lastName email"
    );

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    return res
      .status(200)
      .json({ success: true, job, message: "Get job by id successfully" });
  } catch (error) {
    console.error("Error in getJobById:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching job",
      error: error.message,
    });
  }
};

export const updateJob = async (req, res) => {
  try {
    const { id: jobId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: "Invalid Job ID" });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Only allow employer who posted the job to update
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this job" });
    }

    const updatedJob = await Job.findByIdAndUpdate(jobId, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job: updatedJob,
    });
  } catch (error) {
    console.error("Error updating job: ", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update job",
      error: error.message,
    });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: "Invalid Job ID" });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this job" });
    }

    await job.deleteOne();

    return res
      .status(200)
      .json({ success: true, message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error deleting job: ", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete job",
      error: error.message,
    });
  }
};

export const getEmployerJob = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      message: "Jobs fetched successfully",
      jobs,
    });
  } catch (error) {
    console.error("Error fetching employer jobs:", error);
    res
      .status(500)
      .json({ success: false, message: error.message || "Server error" });
  }
};

// Search endpoint
export const searchJobs = async (req, res) => {
  const { query } = req.query; // Extract the search query from URL params

  try {
    // Query jobs based on title or description containing the search keyword (case insensitive)
    const jobs = await Job.find({
      $or: [
        { title: { $regex: query, $options: "i" } }, // Title contains query
        { description: { $regex: query, $options: "i" } }, // Description contains query
      ],
    });

    // Return the matched jobs
    res.status(200).json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
