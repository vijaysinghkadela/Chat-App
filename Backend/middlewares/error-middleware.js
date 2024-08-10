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

  return res.status(error.statusCode).json({
    success: false,
    message: envMode === "DEVELOPMENT" ? error : error.message,
  });
};

const TryCatch = (passedFunc) => async (req, res, next) => {
  try {
    await passedFunc(req, res, next);
  } catch (error) {
    next(error);
  }
};

export { errorMiddleware, TryCatch };

