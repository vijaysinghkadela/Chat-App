import express from "express";
import {
  acceptFriendRequest,
  getMyFriends,
  getMyNotifications,
  getMyProfile,
  login,
  logout,
  newUser,
  searchUser,
  sendFriendRequest,
} from "../controllers/user-controllers.js";
import { singleAvatar } from "../middlewares/multer-middleware.js";
import { isAuthenticated } from "../middlewares/auth-middleware.js";
import {
  acceptRequestValidator,
  registerValidator,
  sendRequestValidator,
  validateHandler,
} from "../lib/validators.js";

const app = express.Router();

app.post("/new", singleAvatar, registerValidator(), validateHandler, newUser);
app.post("/login", loginValidator(), validateHandler, login);

// After here user must be Logged in to access the routes

app.use(isAuthenticated);

app.get("/me", getMyProfile);

app.get("/logout", logout);

app.get("/search", searchUser);

app.put(
  "/sendrequest",
  sendRequestValidator(),
  validateHandler,
  sendFriendRequest
);

app.put(
  "/acceptrequest",
  acceptRequestValidator(),
  validateHandler,
  acceptFriendRequest
);

app.get(
  "/notifications",
  acceptRequestValidator(),
  getMyNotifications
);

app.get(
  "/friends",
  acceptRequestValidator(),
  getMyFriends
);

export default app;
