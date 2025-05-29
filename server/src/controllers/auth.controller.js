import dotenv from "dotenv";
dotenv.config();
import { User } from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Profile } from "../models/Profile.js";

const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      contactNumber,
      password,
      confirmPassword,
      accountType,
      profileImage,
      company,
      education,
      skills,
      experience,
    } = req.body;

    // check if require details are present
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !accountType ||
      !contactNumber
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // check if password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Password and Confirm Password do not match. Please try again.",
      });
    }

    // check if user exist
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "User already registered, Please sign in.",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // profile details
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      resume: null,
      appliedJobs: [],
    });

    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      accountType,
      profileImage:
        profileImage ||
        `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,

      company: company || "",
      education: education || "",
      skills: Array.isArray(skills) ? skills : skills?.split(",") || [],
      experience: experience || "",
      additionalDetails: profileDetails._id,
    });

    return res.status(200).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.error(`Error registering user`, error);
    res.status(500).json({
      success: false,
      message: "Registration failed. Please try again...",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check for missing field
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: `Please Fill up All the Required Fields`,
      });
    }

    // Find user with provided email
    const user = await User.findOne({ email }).populate("additionalDetails");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: `User is not Registered, Please SignUp to Continue`,
      });
    }

    // const isPasswordCorrect = await bcrypt.compare(password, user.password);

    // Generate JWT token and Compare Password
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        { email: user.email, id: user._id, role: user.accountType },
        process.env.JWT_SECRET,
        {
          expiresIn: "2m",
        }
      );

      // Save token to user document in database
      // user.token = token;
      user.password = undefined;
      // Set cookie for token and return success response
      // const options = {
      //   expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      //   httpOnly: true,
      // };
      // res.cookie("token", token, options).status(200).json({
      //   success: true,
      //   token,
      //   user,
      //   message: `User Login Success`,
      // });
      res.status(200).json({
        success: true,
        token,
        user,
        message: "User login success",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: `Password is incorrect`,
      });
    }
  } catch (error) {
    console.error("error while login", error);
    return res.status(500).json({
      success: false,
      message: "Login Failed, Please Try Again...",
      error: error.message,
    });
  }
};

export { register, login };
