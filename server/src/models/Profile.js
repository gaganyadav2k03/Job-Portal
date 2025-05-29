import mongoose, { Schema } from "mongoose";

const profileSchema = new Schema(
  {
    gender: {
      type: String,
    },
    dateOfBirth: {
      type: String,
    },
    about: {
      type: String,
      trim: true,
    },
    resume: {
      type: String,
    },
    appliedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
      },
    ],

    // JobsPosted: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Job",
    //   },
    // ],
  },
  {
    timestamps: true,
  }
);

export const Profile = mongoose.model("Profile", profileSchema);
