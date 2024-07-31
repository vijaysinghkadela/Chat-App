import express from "express";
import {
  getMyProfile,
  login,
  logout,
  newUser,
} from "../controllers/user-controllers.js";
import { singleAvatar } from "../middlewares/multer-middleware.js";
import { isAuthenticated } from "../middlewares/auth-middleware.js";

const app = express.Router();

app.post("/new", singleAvatar, newUser);
app.post("/login", login);

// After here user must be Logged in to access the routes

app.use(isAuthenticated);

app.get("/me", getMyProfile);

app.get("/logout", logout);

export default app;
