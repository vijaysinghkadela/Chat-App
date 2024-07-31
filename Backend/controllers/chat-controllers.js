import { TryCatch } from "../middlewares/error-middleware.js";
import { ErrorHandler } from "../utils/utility.js";
import {chat} from '../models/chat-models.js';
import { ALERT, REFETCH_CHATS } from "../constants/Events.js";

const newGroupChat = TryCatch(async (req, res, next) => {
  const { name, members } = req.body;

  if (members.length < 2)
    return next(
      new ErrorHandler("Group chat must have at least 3 members", 400)
    );

  const allMembers = [...members, req.user._id];
  await chat.create({
    name,
    groupChat: true,
    creator: req.user,
    members: allMembers,
  });

  emitEvent(
    req,
    ALERT,
    allMembers,
    `Welcome to the group chat ${name} by ${req.user.name} `
  );
  emitEvent(req, REFETCH_CHATS, members);

  return res.status(201).json({ success: true, message: "Group chat created" });
});

export { newGroupChat };
