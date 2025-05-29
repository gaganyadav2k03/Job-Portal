import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    contactNumber: {
      type: Number,
      trim: true,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    accountType: {
      type: String,
      enum: ["employer", "jobSeeker"],
      required: true,
    },

    profileImage: {
      type: String,
      default: "",
    },

    company: {
      type: String,
    },

    education: {
      type: String,
    },

    skills: {
      type: [String],
      default: [],
    },

    experience: {
      type: String,
    },

    active: {
      type: Boolean,
      default: true,
    },

    additionalDetails: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Profile",
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);
