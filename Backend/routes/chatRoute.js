import express from "express";
import {
  addMembers,
  deleteChat,
  getchatDetails,
  getMessages,
  getMyChats,
  getMyGroups,
  leaveGroup,
  newGroupChat,
  removeMember,
  renameGroup,
  sendAttachment,
} from "../controllers/chat-controllers.js";
import {
  addMemberValidator,
  chatIdValidator,
  newGroupValidator,
  removeMemberValidator,
  renameValidator,
  sendAttachmentValidator,
  validateHandler,
} from "../lib/validators.js";
import { isAuthenticated } from "../middlewares/auth-middleware.js";
import { attachmentsMulter } from "../middlewares/multer-middleware.js";

const app = express.Router();

// After here user must be Logged in to access the routes

app.use(isAuthenticated);

app.post("/new", newGroupValidator(), validateHandler, newGroupChat);

app.get("/my", getMyChats);

app.get("/my/groups", getMyGroups);

app.put("/addmembers", addMemberValidator(), validateHandler, addMembers);

app.put(
  "/removemembers",
  removeMemberValidator(),
  validateHandler,
  removeMember
);

app.delete("/leave/:id", chatIdValidator(), validateHandler, leaveGroup);

// send attachment
app.post(
  "/message",
  attachmentsMulter,
  sendAttachmentValidator(),
  validateHandler,
  sendAttachment
);

// Get Messages
app.get("/message/:id", chatIdValidator(), validateHandler, getMessages);

// get chat details ,rename , delete chat
app
  .route("/:id")
  .get(chatIdValidator(), validateHandler, getchatDetails)
  .put(renameValidator(), validateHandler, renameGroup)
  .delete(renameValidator(), validateHandler, deleteChat);

export default app;
