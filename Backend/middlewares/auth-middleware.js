import jwt from "jsonwebtoken";
import { ErrorHandler } from "../utils/utility.js";
import { adminSecretKey } from "../app.js";
import { TryCatch } from "./error-middleware.js";
import { CHATAPP_tOKEN } from "../constants/config.js";
import { User } from "../models/user-models.js";

const isAuthenticated = TryCatch((req, res, next) => {
  const token = req.cookies[CHATAPP_tOKEN];

  if (!token)
    return next(new ErrorHandler("Please login to access this  route", 401));

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  req.user = decodedData._id;

  next();
});

const adminOnly = (req, res, next) => {
  const token = req.cookies["ChatApp-admin-token"];

  if (!token)
    return next(new ErrorHandler("Only Admin Can Access these  route", 401));

  const secretKey = jwt.verify(token, process.env.JWT_SECRET);

  isMatched = secretKey === adminSecretKey;

  if (!isMatched)
    return next(new ErrorHandler("Only Admin Can Access these  route", 401));

  next();
};

const socketAuthenticator = async (error, socket, next) => {
  try {
    if (error) return next(error);

    const authtoken = socket.request.cookies[CHATAPP_tOKEN];

    if (!authtoken)
      return next(new ErrorHandler("Please login to access this route", 401));

    const decodedData = jwt.verify(authtoken, process.env.JWT_SECRET);

    const user = await User.findById(decodedData._id);

    if (!user) return next(new ErrorHandler("User Not Found", 404));

    socket.user = user;

    return next();
  } catch (error) {
    return next(new ErrorHandler(`Authentication Failed : ${error}`, 401));
  }
};

export { isAuthenticated, adminOnly, socketAuthenticator };
