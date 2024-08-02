import express from "express";
import { isAuthenticated } from "../middlewares/auth-middleware.js";
import {
  addMembers,
  getMyChats,
  getMyGroups,
  leaveGroup,
  newGroupChat,
  removeMember,
} from "../controllers/chat-controllers.js";

const app = express.Router();

// After here user must be Logged in to access the routes

app.use(isAuthenticated);

app.post("/new", newGroupChat);

app.get("/my", getMyChats);

app.get("/my/groups", getMyGroups);

app.put("/addmembers", addMembers);

app.put("/removemembers", removeMember);

app.delete("/leave/:id" , leaveGroup )

// send attachment

// Get Messages 

// get chat details ,rename , delete chat

export default app;
