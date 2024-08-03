import express from "express";
import { isAuthenticated } from "../middlewares/auth-middleware.js";
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
import { attachmentsMulter } from "../middlewares/multer-middleware.js";

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
app.post('/message', attachmentsMulter , sendAttachment )

// Get Messages
app.get('/message/:id', getMessages)


// get chat details ,rename , delete chat
app.route("/:id").get(getchatDetails).put(renameGroup).delete(deleteChat);

export default app;
