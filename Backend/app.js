import express from "express";
const app = express();
import userRoute from "./routes/userRoute.js";
import { connectDB } from "./utils/features.js";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

const mongoURI = process.env.MONGO_URI;

const port = process.env.PORT || 3000;

connectDB(mongoURI);

app.use("/user", userRoute);

app.get("/", (req, res) => {
  res.send("Hello World"); // This is a test endpoint to check server connection.  Replace this with your own logic.  :)
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}...  :)  `);
});
