import express from "express";

import { v2 as cloudinary } from "cloudinary";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import { v4 as uuid } from "uuid";
import { errorMiddleware } from "./middlewares/error-middleware.js";
import { connectDB } from "./utils/features.js";

import { NEW_MESSAGE, NEW_MESSAGE_ALERT } from "./constants/Events.js";
import { getSokets } from "./lib/helper.js";
import { Message } from "./models/message-models.js";
import { corsOptions } from "./constants/config.js";
import { socketAuthenticator } from "./middlewares/auth-middleware.js";

// Here is imported all routes.
import adminRoute from "./routes/adminRoute.js";
import chatRoute from "./routes/chatRoute.js";
import userRoute from "./routes/userRoute.js";

dotenv.config({
  path: "./.env",
});

const mongoURI = process.env.MONGO_URI;

connectDB(mongoURI);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: corsOptions,
});

const port = process.env.PORT || 3000;
const envMode = process.env.NODE_ENV.trim() || "PRODUCTION";
const adminSecretKey = process.env.ADMIN_SECRET_KEY;
const userSocketIDs = new Map();

// using Middlewares Here

// Middleware to parse incoming JSON data.
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.use("/api/v1/user", userRoute);
app.use("/api/v1/chat", chatRoute);
app.use("/api/v1/admin", adminRoute);

app.get("/", (req, res) => {
  // This is a test endpoint to check server connection.
  res.send("Hello World");
});

io.use((socket, next) => {
  cookieParser()(
    socket.request,
    socket.request.res,
    async (error) => await socketAuthenticator(error, socket, next)
  );
});

io.on("connection", (socket) => {
  const user = socket.user;
  
  userSocketIDs.set(user._id.toString(), socket.id);
  console.log("a user connected", socket.id);

  socket.on(NEW_MESSAGE, async ({ chatId, members, message }) => {
    const messageForRealTime = {
      content: message,
      _id: uuid(),
      sender: {
        _id: user._id,
        name: user.name,
      },
      chat: chatId,
      createAt: new Date().toISOString(),
    };

    const messageForDB = {
      content: message,
      sender: user._id,
      chat: chatId,
    };

    const membersSocket = getSokets(members);
    io.to(membersSocket).emit(NEW_MESSAGE, {
      chatId,
      message: messageForRealTime,
    });
    io.to(membersSocket).emit(NEW_MESSAGE_ALERT, {
      chatId,
    });
    try {
      await Message.create(messageForDB);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    userSocketIDs.delete(user._id.toString());
  });
});

app.use(errorMiddleware);

server.listen(port, () => {
  console.log(`Server is running on port ${port} in ${envMode} Mode. `);
});

export { adminSecretKey, envMode, userSocketIDs };
