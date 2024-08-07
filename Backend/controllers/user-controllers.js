import bcrypt from "bcrypt";
import { User } from "../models/user-models.js";
import { cookieOptions, emitEvent, sendToken } from "../utils/features.js";
import { TryCatch } from "../middlewares/error-middleware.js";
import { ErrorHandler } from "../utils/utility.js";
import { chat, chat } from "../models/chat-models.js";
import { Request } from "../models/request-models.js";
import { NEW_REQUEST, REFETCH_CHATS } from "../constants/Events.js";
import { getOtherMember } from "../lib/helper.js";

// Create a new user and save it to the database and save the JWT token in the response...

const newUser = TryCatch(async (req, res, next) => {
  const { name, username, password, bio } = req.body;

  const file = req.file;

  if (!file) return next(new ErrorHandler("Please upload an avatar", 400));

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
});

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

const getMyProfile = TryCatch(async (req, res, next) => {
  const user = await User.findById(req.user);

  if (!user) return next(new ErrorHandler("User not found", 404));

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

  // Finding All my chats
  const myChats = await chat.find({
    groupChat: false,
    members: req.user,
  });

  // extracting All Users from my chats means friends or people i have chatted with me
  const allUsersFromMyChats = myChats.flatMap((chat) => chat.members);

  // Finding all users except me and my friends
  const allUsersExceptMeAndFriends = await User.find({
    _id: { $nin: allUsersFromMyChats },
    name: { $regex: name, $option: "i" },
  });

  // Modifying the response
  const users = allUsersExceptMeAndFriends.map(({ _id, name, avatar }) => ({
    _id,
    name,
    avatar: avatar.url,
  }));

  return res.status(200).json({
    success: true,
    message: name,
  });
});

const sendFriendRequest = TryCatch(async (req, res) => {
  const { userId } = req.body;

  const request = await Request.findOne({
    $or: [
      { sender: req.user, receiver: userId },
      { sender: userId, receiver: req.user },
    ],
  });

  if (request)
    return next(new ErrorHandler("Friend request already sent", 400));

  await Request.create({
    sender: req.user,
    receiver: userId,
  });

  emitEvent(req, NEW_REQUEST, [userId]);

  return res.status(200).json({
    success: true,
    message: " Friend request sent",
  });
});

const acceptFriendRequest = TryCatch(async (req, res, next) => {
  const { requestId, accept } = req.body;

  const request = await Request.findById(requestId)
    .populate("sender", "name")
    .populate("receiver", "name");

  if (!request) return next(new ErrorHandler("Request not found", 404));

  if (request.receiver._id.toString() !== req.user.toString())
    return next(
      new ErrorHandler("You are not authorized to accept this request", 401)
    );

  if (!accept) {
    await request.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Friend request rejected",
    });
  }

  const members = [request.sender._id, request.receiver._id];

  await Promise.all([
    chat.create({
      members,
      name: `${request.sender.name} - ${request.receiver.name} Chat`,
    }),
    request.deleteOne(),
  ]);

  emitEvent(req, REFETCH_CHATS, members);

  return res
    .status(200)

    .json({
      success: true,
      message: "Friend Request Accepted",
      senderId: request.sender._id,
    });
});

const getMyNotifications = TryCatch(async (req, res) => {
  const requests = await Request.find({ receiver: req.user }).populate(
    "sender",
    "name",
    "avatar"
  );

  const allRequests = requests.map(({ sender, _id }) => ({
    _id,
    sender: {
      _id: sender._id,
      name: sender.name,
      avatar: sender.avatar.url,
    },
  }));

  return res.status(200).json({
    success: true,
    requests: allRequests,
  });
});

const getMyFriends = TryCatch(async (req, res) => {
  const chatId = req.query.chatId;

  const chats = await chat
    .find({ members: req.user, groupChat: false })
    .populate("members", "name avatar");

  const friends = chats.map(({ members }) => {
    const otherUser = getOtherMember(members, req.user);

    return {
      _id: otherUser._id,
      name: otherUser.name,
      avatar: otherUser.avatar.url,
    };
  });

  if (chatId) {
    const chat = await chat.findById(chatId);

    const availableFriends = friends.filter(
      (friend) => !chat.members.includes(friend._id)
    );

    return res.status(200).json({
      success: true,
      friends: availableFriends,
    });
  } else {
    return res.status(200).json({
      success: true,
      friends,
    });
  }
});

export {
  login,
  newUser,
  getMyProfile,
  logout,
  searchUser,
  sendFriendRequest,
  acceptFriendRequest,
  getMyNotifications,
  getMyFriends,
};
