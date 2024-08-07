import { TryCatch } from "../middlewares/error-middleware.js";
import { ErrorHandler } from "../utils/utility.js";
import { chat, chat } from "../models/chat-models.js";
import {
  ALERT,
  NEW_ATTACHMENT,
  NEW_MESSAGE_ALERT,
  REFETCH_CHATS,
} from "../constants/Events.js";
import { getOtherMember } from "../lib/helper.js";
import { User } from "../models/user-models.js";
import { Message } from "../models/message-models.js";
import { deleteFilesFromCloudinary, emitEvent } from "../utils/features.js";

// Create a new group chat and save it to the database
const newGroupChat = TryCatch(async (req, res, next) => {
  const { name, members } = req.body;

  // Get all users from the members array
  const allMembers = [...members, req.user._id];
  await chat.create({
    name,
    groupChat: true,
    creator: req.user,
    members: allMembers,
  });

  // Emit an event to refresh the chats list
  return res.status(201).json({ success: true, message: "Group chat created" });
});

// Get all chats belonging to the authenticated user
const getMyChats = TryCatch(async (req, res, next) => {
  // Find all chats where the authenticated user is a member and populate the members array with their names and avatars
  const chats = await chat
    .find({ members: req.user })
    .populate("members", "name  avatar");

  // Transform the chats array to include the other member's name and avatar for group chats, or the other member's avatar for one-on-one chats
  const transformedChats = chats.map(({ _id, name, members, groupChat }) => {
    const otherMember = getOtherMember(members, req.user);

    // Emit an event to notify the new member(s) that a new chat has been created
    return {
      _id,
      groupChat,
      avatar: groupChat
        ? members.slice(0, 3).map(({ avatar }) => avatar.url)
        : [otherMember.avatar.url],
      name: groupChat ? name : otherMember.name,
      members: members.reduce((prev, curr) => {
        //  Only include the member(s) who are not the authenticated user in the members array
        if (curr._id.toString() !== req.user.toString()) {
          prev.push(curr._id);
        }
        return prev;
      }, []),
    };
  });
  //  Emit an event to notify the new member(s) that a new chat has been created
  return res.status(200).json({ success: true, chats: transformedChats });
});

//  Get all groups belonging to the authenticated user
const getMyGroups = TryCatch(async (req, res, next) => {
  // Find all chats where the authenticated user is the creator and the chat is a group chat and
  const chats = await chats
    .find({
      members: req.user,
      groupChat: true,
      creator: req.user,
    })
    .populate("members", "name  avatar");

  // Transform the chats array to include the other member's name and avatar for group chats, or the other member's avatar for one-on-one chats
  const groups = chats.map(({ _id, name, members, groupChat }) => ({
    _id,
    name,
    groupChat,
    avatar: members.slice(0, 3).map(({ avatar }) => avatar.url),
  }));
  // Emit an event to notify the new member(s) that a new chat has been created
  return res.status(200).json({ success: true, groups });
});

// Add members to a group chat
const addMembers = TryCatch(async (req, res, next) => {
  const { chatId, members } = req.body;

  //  Check if the authenticated user is the creator of the group chat
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

  const uniqueMembers = allNewMembers
    .filter((i) => !chat.members.includes(i._id.toString()))
    .map((i) => i._id);

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

// Remove a member from a group chat
const removeMember = TryCatch(async (req, res, next) => {
  const { userId, chatId } = req.body;

  const [chat, userThatWillBeRemoved] = await Promise.all([
    chat.findById(chatId),
    User.findById(userId, "name"),
  ]);

  if (!chat) return next(new ErrorHandler("Chat not found", 404));

  if (!chat.groupChat)
    return next(new ErrorHandler("This is not a group chat", 404));

  if (chat.creator.toString() !== req.user.toString())
    return next(
      new ErrorHandler("You are not the creator of this group chat", 403)
    );

  if (chat.members.length <= 3)
    return next(new ErrorHandler("Group must have at least 3 members", 400));

  chat.members = chat.members.filter(
    (member) => member.toString() !== userId.toString()
  );

  await chat.save();

  emitEvent(
    req,
    ALERT,
    chat.members,
    `${userThatWillBeRemoved.name} has been removed from ${chat.name} Group`
  );

  emitEvent(req, REFETCH_CHATS, chat.members);

  return res
    .status(200)
    .json({ success: true, message: "Member removed successfully" });
});

// Member is left from Group Chat  and New Creator is Randomly Selected  from Remaining Members  and Updated in Chat

const leaveGroup = TryCatch(async (req, res, next) => {
  const chatId = req.params.id;

  const chat = await chat.findById(chatId);

  if (!chat) return next(new ErrorHandler("Chat not found", 404));

  if (!chat.groupChat)
    return next(new ErrorHandler("This is not a group chat", 404));

  const remainingMembers = chat.members.filter(
    (member) => member.toString() !== req.user.toString()
  );

  if (remainingMembers.length < 3)
    return next(new ErrorHandler("Group must have at least 3 members", 400));

  if (chat.creator.toString() === req.user.toString()) {
    const randomElement = Math.floor(Math.random() * remainingMembers.length);

    const newCreator = remainingMembers[randomElement];

    chat.creator = newCreator;
  }

  chat.members = remainingMembers;

  const [user] = await Promise.all([
    User.findById(req.user, "name"),
    chat.save(),
  ]);

  emitEvent(req, ALERT, chat.members, `User ${user.name} has left the Group`);

  emitEvent(req, REFETCH_CHATS, chat.members);

  return res
    .status(200)
    .json({ success: true, message: "Member removed successfully" });
});

const sendAttachment = TryCatch(async (req, res, next) => {
  const { chatId } = req.body;

  const [chat, me] = await Promise.all([
    chat.findById(chatId),
    User.findById(req.user, "name avatar"),
  ]);

  if (!chat) return next(new ErrorHandler("Chat not found", 404));

  const files = req.files || [];

  if (files.length < 1)
    return next(new ErrorHandler("Please provide attachments", 400));

  // Upload Files here
  const attachmens = [];

  const messageForDB = {
    content: "",
    attachmens,
    sender: {
      _id: me._id,
      name: me.name,
    },
    chat: chatId,
  };

  const messageForRealTime = {
    ...messageForDB,
    sender: {
      _id: me._id,
      name: me.name,
    },
  };

  const message = await chat.Message.create(messageForDB);

  emitEvent(req, NEW_ATTACHMENT, chat.messages, {
    message: messageForRealTime,
    chatId,
  });

  emitEvent(req, NEW_MESSAGE_ALERT, chat.members, { chatId });

  return res.status(200).json({ success: true, message });
});

const getchatDetails = TryCatch(async (req, res, next) => {
  if (req.query.populate === "true") {
    const chat = await chat
      .findById(req.params.id)
      .populate("members", "name avatar")
      .lean();

    if (!chat) return next(new ErrorHandler("Chat not found", 404));

    chat.messages = await chat.members.map(({ _id, name, avatar }) => ({
      _id,
      name,
      avatar,
    }));

    return res.status(200).json({ success: true, chat });
  } else {
    const chat = await chat.findById(req.params.id);
    if (!chat) return next(new ErrorHandler("Chat not found", 404));

    return res.status(200).json({ success: true, chat });
  }
});

const renameGroup = TryCatch(async (req, res, next) => {
  const chatId = req.params.id;
  const { name } = req.body;

  const chat = await chat.findById(chatId);
  if (!chat) return next(new ErrorHandler("Chat not found", 404));

  if (!chat.groupChat)
    return next(new ErrorHandler("This is not a group chat", 404));

  if (chat.creator.toString() !== req.user.toString())
    return next(
      new ErrorHandler("You are not allowed to rename the group chat", 404)
    );

  chat.name = name;

  await chat.save();

  emitEvent(req, REFETCH_CHATS, chat.members);

  return res
    .status(200)
    .json({ success: true, message: "Group renamed successfully" });
});

const deleteChat = TryCatch(async (req, res, next) => {
  const chatId = req.params.id;
  const { name } = req.body;

  const chat = await chat.findById(chatId);
  if (!chat) return next(new ErrorHandler("Chat not found", 404));

  const members = chat.members;

  if (chat.groupChat && chat.creator.toString() !== req.user.toString()) {
    return next(
      new ErrorHandler("You are not allowed to delete the group chat", 403)
    );
  }

  // Here we have to delete all Messages as well as attachments or files from cloudinary.

  const messagesWithAttachements = await Message.find({
    chat: chatId,
    attachments: { $exists: true, $ne: [] },
  });

  const public_ids = [];

  messagesWithAttachements.forEach(({ attachmens }) => {
    attachmens.forEach(({ public_id }) => {
      public_ids.push(public_id);
    });
  });

  await Promise.all([
    // DeleteFiles from Cloudinary.
    deleteFilesFromCloudinary(public_ids),
    chat.deleteChat(),
    Message.deleteMany({ chat: chatId }),
  ]);

  emitEvent(req, REFETCH_CHATS, members);

  return res
    .status(200)
    .json({ success: true, message: "Chat deleted successfully" });
});

const getMessages = TryCatch(async (req, res, next) => {
  const chatId = req.params.id;

  const { page = 1 } = req.query;

  const resultPerPage = 20;
  const skip = (page - 1) * resultPerPage;

  const [messages, totalMessagesCount] = await Promise.all([
    Message.find({ chat: chatId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(resultPerPage)
      .populate("sender", "name")
      .lean(),
    Message.countDocuments({ chat: chatId }),
  ]);

  const totalPages = Math.ceil(totalMessagesCount / resultPerPage);

  return res
    .status(200)
    .json({ success: true, messages: messages.reverse(), totalPages });
});

export {
  newGroupChat,
  getMyChats,
  getMyGroups,
  addMembers,
  removeMember,
  leaveGroup,
  sendAttachment,
  getchatDetails,
  renameGroup,
  deleteChat,
  getMessages,
};
