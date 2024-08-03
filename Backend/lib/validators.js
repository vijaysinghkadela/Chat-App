import { body, validationResult } from "express-validator";

const registerValidator = () => [
  body(["name", "Please Enter Name"]).notEmpty(),
  body(["username", "Please Enter Username"]).notEmpty(),
  body(["bio", "Please Enter bio"]).notEmpty(),
  body(["password", "Please Enter password"]).notEmpty(),
];

const validateHandler = (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors);

  if (errors.isEmpty()) return next();
};

export { registerValidator, validateHandler };
