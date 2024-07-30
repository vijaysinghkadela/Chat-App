import express from "express";
import { login, newUser } from "../controllers/user-controllers.js";

const app = express.Router();

app.post("/newuser", newUser);
app.post("/login", login);

export default app;
