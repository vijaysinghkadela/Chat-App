import express from "express";
const app = express();
import userRoute from "./routes/user.js";

app.use("/user", userRoute);

app.get("/", (req, res) => {
  res.send("Hello World"); // This is a test endpoint to check server connection.  Replace this with your own logic.  :)
});

app.listen(3000, () => {
  console.log("Server is running on port 3000...  :)  ");
});
