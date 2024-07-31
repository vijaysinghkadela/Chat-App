import bcrypt from "bcrypt";
import { User } from "../models/user-models.js";
import { cookieOptions, sendToken } from "../utils/features.js";
import { TryCatch } from "../middlewares/error-middleware.js";
import { ErrorHandler } from "../utils/utility.js";

// Create a new user and save it to the database and save the JWT token in the response...

const newUser = async (req, res, next) => {
  const { name, username, password, bio } = req.body;

  const Avatar = {
    public_id: "wsdasd",
    url: "https://example.com/avatar.jpg",
  };

  const user = await User.create({
    name,
    bio,
    username,
    password,
    Avatar,
  });

  sendToken(res, user, 201, "User created successfully");
};

// Login user and save token in cookie
const login = TryCatch(async (req, res) => {
  const { username, password } = req.body;

  // Check if user exists
  const user = await User.findOne({ username }).select("+password");

  if (!user) return next(new ErrorHandler("Invalid Username Or Password", 404));
  res.status(400).json({ message: "User not found" });

  // Compare passwords
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return next(new ErrorHandler("Invalid Username Or Password", 404));

  // Generate and send JWT token
  sendToken(res, user, 200, `Welcome back ${user.name} to the chat app!`);
});

const getMyProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.user);

  res.status(200).json({
    success: true,
    user,
  });
});

// Logout user and remove token from cookie
const logout = TryCatch(async (req, res) => {
  return res
    .status(200)
    .cookie("ChatApp-token", "", { ...cookieOptions, maxAge: 0 })
    .json({
      success: true,
      message: " Logged out successfully!  ",
    });
});

const searchUser = TryCatch(async (req, res) => {
  
  const { name } = req.query;
  
  
  
  
  return res
    .status(200)
    .json({
      success: true,
      message: name,
    });
});

export { login, newUser, getMyProfile, logout, searchUser };
