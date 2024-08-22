import { envMode } from "../app.js";

const errorMiddleware = (error, req, res, next) => {
  error.message ||= `Internal Server Error`;
  error.statusCode ||= 500;

  // 11000 duplicate key error in MongoDB
  if (error.code === 11000) {
    const error = Object.keys(error.keyPattern).join(",");
    error.message = `Duplicate field - ${error}`;
    error.statusCode = 400;
  }

  if (error.name === "CastError") {
    const errorPath = error.path;
    error.message = `Invalid Format of ${errorPath}`;
    error.statusCode = 400;
  }

  const response = {
    success: false,
    message:  error.message,
  }

  if(envMode === "DEVELOPMENT"){
    response.error = error;
  }

  return res.status(error.statusCode).json(response);
};

const TryCatch = (passedFunc) => async (req, res, next) => {
  try {
    await passedFunc(req, res, next);
  } catch (error) {
    next(error);
  }
};

export { errorMiddleware, TryCatch };

