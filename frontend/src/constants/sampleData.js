import { Avatar } from "@mui/material";

export const sampleChats = [
  {
    avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
    name: "John Doe",
    _id: "1",
    groupChat: false,
    members: ["1", "2"],
  },
  {
    avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
    name: "John boi",
    _id: "2",
    groupChat: false,
    members: ["1", "2"],
  },
];

export const sampleUsers = [
  {
    avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
    name: "John Doe",
    _id: "2",
  },
  {
    avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
    name: "John boi",
    _id: "2",
  },
];

export const sampleNotifications = [
  {
    sender: {
      avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
      name: "John Doe",
    },
    _id: "2",
  },
  {
    sender: {
      avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
      name: "John boi",
    },
    _id: "2",
  },
];

export const sampleMessages = [
  {
    attachments: [
      {
        public_id: "asdasd",
        url: "https://www.w3schools.com/howto/img_avatar.png",
      },
    ],
    content: "Luda ka Message hai",
    _id: "aslfjasl",
    sender: {
      _id: "user._id",
      name: "Chaman",
    },
    chat: "chatId",

    createdAt: "2022-02-02T10:00:00.630Z",
  },
];

export const dashboardData = {
  users: [
    {
      name: "John Doe",
      avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
      _id: "1",
      username: "john_doe",
      friends: 20,
      groups: 5,
    },
    {
      name: "John boi",
      avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
      _id: "2",
      username: "john_boi",
      friends: 15,
      groups: 3,
    },
  ],

  chats: [
    {
      name: "John Doe",
      avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
      _id: "1",
      groupChat: false,
      members: [
        { _id: "1", avatar: "https://www.w3schools.com/howto/img_avatar.png" },
        { _id: "2", avatar: "https://www.w3schools.com/howto/img_avatar.png" },
      ],
      totalMembers: 2,
      totalMessages: 20,
      creater: {
        name: "John Doe",
        avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
        _id: "1",
      },
    },
    {
      name: "John boi",
      avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
      _id: "2",
      groupChat: false,
      members: [
        { _id: "1", avatar: "https://www.w3schools.com/howto/img_avatar.png" },
        { _id: "2", avatar: "https://www.w3schools.com/howto/img_avatar.png" },
      ],
      totalMembers: 2,
      totalMessages: 15,
      creater: {
        name: "John boi",
        avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
        _id: "2",
      },
    },
  ],

  messages: [
    {
      content: "Luda ka Message hai",
      _id: "aslfjasl",
      sender: {
        avatar: "https://www.w3schools.com/howto/img_avatar.png",
        name: "Chaman",
      },
      chat: "chatId",
      groupChat: false,
      createdAt: "2022-02-02T10:00:00.630Z",
    },
    {
      content: "Luda ka Message hai",
      _id: "aslfjasl",
      sender: {
        avatar: "https://www.w3schools.com/howto/img_avatar.png",
        name: "John Doe",
      },
      chat: "chatId",
      groupChat: true,
      createdAt: "2022-02-02T10:00:01.630Z",
    },
  ],
};
