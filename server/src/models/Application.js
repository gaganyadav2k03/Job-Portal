import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    applicantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    resume: {
      type: String,
    },

    status: {
      type: String,
      enum: ["applied", "reviewed", "interviewed", "hired", "rejected"],
      default: "applied",
    },

    coverLetter: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Application = mongoose.model("Application", applicationSchema);
