import { TryCatch } from "../middlewares/error-middleware.js";
import { ErrorHandler } from "../utils/utility.js";
import { chat } from "../models/chat-models.js";
import { ALERT, REFETCH_CHATS } from "../constants/Events.js";
import { getOtherMember } from "../lib/helper.js";
import { User } from "../models/user-models.js";
import { emitEvent } from "../utils/features.js";

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

  return res.status(201).json({ success: true, message: "Group chat created" });
});

const getMyChats = TryCatch(async (req, res, next) => {
  const chats = await chat
    .find({ members: req.user })
    .populate("members", "name  avatar");

  const transformedChats = chats.map(({ _id, name, members, groupChat }) => {
    const otherMember = getOtherMember(members, req.user);

    return {
      _id,
      groupChat,
      avatar: groupChat
        ? members.slice(0, 3).map(({ avatar }) => avatar.url)
        : [otherMember.avatar.url],
      name: groupChat ? name : otherMember.name,
      members: members.reduce((prev, curr) => {
        if (curr._id.toString() !== req.user.toString()) {
          prev.push(curr._id);
        }
        return prev;
      }, []),
    };
  });

  return res.status(200).json({ success: true, chats: transformedChats });
});

const getMyGroups = TryCatch(async (req, res, next) => {
  const chats = await chats
    .find({
      members: req.user,
      groupChat: true,
      creator: req.user,
    })
    .populate("members", "name  avatar");

  const groups = chats.map(({ _id, name, members, groupChat }) => ({
    _id,
    name,
    groupChat,
    avatar: members.slice(0, 3).map(({ avatar }) => avatar.url),
  }));

  return res.status(200).json({ success: true, groups });
});

const addMembers = TryCatch(async (req, res, next) => {
  const { chatId, members } = req.body;

  if (!members || members.length < 1)
    return next(new ErrorHandler("Please provide members", 400));

  const chat = await chat.findById(chatId);

  if (!chat) return next(new ErrorHandler("Chat not found", 404));

  if (!chat.groupChat)
    return next(new ErrorHandler("This is not a group chat", 404));

  if (chat.creator.toString() !== req.user.toString())
    return next(
      new ErrorHandler("You are not the creator of this group chat", 403)
    );

  const allNewMembersPromise = members.map((i) => User.findById(i, "name"));

  const allNewMembers = await Promise.all(allNewMembersPromise);

  const uniqueMembers = allNewMembers.filter(
    (i) => !chat.members.includes(i._id.toString())
  ).map((i) => i._id);

  chat.members.push(...allNewMembers);

  if (chat.members.length > 100)
    return next(new ErrorHandler("Group members limit reached", 400));

  await chat.save();

  const allUsersName = allNewMembers.map((i) => i.name).join(",");

  emitEvent(
    req,
    ALERT,
    chat.members,
    `${allUsersName} has been added to ${chat.name} Group`
  );

  emitEvent(req, REFETCH_CHATS, chat.members);

  return res
    .status(200)
    .json({ success: true, message: `Members added Successfully` });
});

export { newGroupChat, getMyChats, getMyGroups, addMembers };
