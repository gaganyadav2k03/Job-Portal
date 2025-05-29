import { Profile } from "../models/Profile.js";

// @desc   Get logged-in user's profile
// @route  GET /api/profile/me
export const getProfile = async (req, res) => {
  try {
    const profileId = req.user.additionalDetails;

    const profile = await Profile.findById(profileId).lean();

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

// @desc   Update logged-in user's profile
// @route  PUT /api/profile/update
export const updateProfile = async (req, res) => {
  try {
    const profileId = req.user.additionalDetails;
    const updateData = req.body;

    const updatedProfile = await Profile.findByIdAndUpdate(
      profileId,
      updateData,
      { new: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

// @desc   Add applied job to profile (internally used)
// @route  N/A - called when applying for a job
export const addAppliedJobToProfile = async (userId, jobId) => {
  try {
    await Profile.findByIdAndUpdate(
      userId.additionalDetails,
      { $addToSet: { appliedJobs: jobId } } // $addToSet avoids duplicates
    );
  } catch (error) {
    console.error("Error adding applied job to profile:", error);
  }
};
