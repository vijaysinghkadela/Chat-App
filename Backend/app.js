import express from "express";
const app = express();

import { connectDB } from "./utils/features.js";
import dotenv from "dotenv";
import { errorMiddleware } from "./middlewares/error-middleware.js";
import cookieParser from "cookie-parser";

import userRoute from "./routes/userRoute.js";
import chatRoute from "./routes/chatRoute.js";
import { createUser } from "./seeders/user-seeders.js";

dotenv.config({
  path: "./.env",
});

const mongoURI = process.env.MONGO_URI;

connectDB(mongoURI);

const port = process.env.PORT || 3000;


// using Middlewares Here

// Middleware to parse incoming JSON data.
app.use(express.json());
app.use(cookieParser());

app.use("/user", userRoute);
app.use("/chat", chatRoute);


app.get("/", (req, res) => {
  res.send("Hello World"); // This is a test endpoint to check server connection.  Replace this with your own logic.  :)
});

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server is running on port ${port}...  :)  `);
});
