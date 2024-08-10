import express from "express";

import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { errorMiddleware } from "./middlewares/error-middleware.js";
import { connectDB } from "./utils/features.js";
import { createServer } from "http";
import { v4 as uuid } from "uuid";
import cors from "cors";

import adminRoute from "./routes/adminRoute.js";
import chatRoute from "./routes/chatRoute.js";
import userRoute from "./routes/userRoute.js";
import { NEW_MESSAGE, NEW_MESSAGE_ALERT } from "./constants/Events.js";
import { getSokets } from "./lib/helper.js";
import { Message } from "./models/message-models.js";

dotenv.config({
  path: "./.env",
});

const mongoURI = process.env.MONGO_URI;

connectDB(mongoURI);

const app = express();
const server = createServer(app);
const io = new Server(server, {});
const port = process.env.PORT || 3000;
const envMode = process.env.NODE_ENV.trim() || "PRODUCTION";
const adminSecretKey = process.env.ADMIN_SECRET_KEY;
const userSocketIDs = new Map();

// using Middlewares Here

// Middleware to parse incoming JSON data.
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ""
}));

app.use("/api/v1/user", userRoute);
app.use("/api/v1/chat", chatRoute);
app.use("/api/v1/admin", adminRoute);

app.get("/", (req, res) => {
  res.send("Hello World"); // This is a test endpoint to check server connection.  Replace this with your own logic.  :)
});

io.use((socket, next) => {
  
})




io.on("connection", (socket) => {
  const user = {
    _id: "asjdola",
    name: "asdhjoajsd",
  };
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
