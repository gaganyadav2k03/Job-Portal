import multer from "multer";
import path from "path";
import crypto from "crypto";

// Storage Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "resume") {
      cb(null, "uploads/resumes");
    } else if (file.fieldname === "profileImage") {
      cb(null, "uploads/profileImages");
    } else {
      cb(null, "uploads");
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    // Generate a unique random string
    const randomName = crypto.randomBytes(10).toString("hex");

    // Sanitize original filename (remove spaces/special chars)
    const originalName = file.originalname
      .split(".")[0]
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9\-]/g, "");

    cb(null, `${file.fieldname}-${originalName}-${randomName}${ext}`);
  },
});

// File Filter
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "resume") {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed for resumes"), false);
    }
  } else if (file.fieldname === "profileImage") {
    if (!["image/jpeg", "image/png"].includes(file.mimetype)) {
      return cb(
        new Error("Only JPG or PNG files are allowed for profile images"),
        false
      );
    }
  }
  cb(null, true);
};

// Multer Uploaders
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max size
});

export const uploads = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max size
});
