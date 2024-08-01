import express from "express";
import { isAuthenticated } from "../middlewares/auth-middleware.js";
import {
  addMembers,
  getMyChats,
  getMyGroups,
  newGroupChat,
} from "../controllers/chat-controllers.js";

const app = express.Router();

// After here user must be Logged in to access the routes

app.use(isAuthenticated);

app.post("/new", newGroupChat);

app.get("/my", getMyChats);

app.get("/my/groups", getMyGroups);

app.put("/addmembers", addMembers);

export default app;
