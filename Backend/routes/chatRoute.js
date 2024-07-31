import express from "express";
import { isAuthenticated } from "../middlewares/auth-middleware.js";
import { newGroupChat } from "../controllers/chat-controllers.js";

const app = express.Router();



// After here user must be Logged in to access the routes

app.use(isAuthenticated);

app.post("/new"  , newGroupChat);


export default app;
