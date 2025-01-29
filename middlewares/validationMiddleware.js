const { body } = require("express-validator");

const validateRegister = [
  body("username")
    .escape()
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long")
    .isAlphanumeric()
    .withMessage("Username must contain only letters and numbers")
    .notEmpty()
    .withMessage("Username is required"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .notEmpty().withMessage("Password is required"),
];

const validateLogin = [
  body("username")
    .escape()
    .trim()
    .isAlphanumeric()
    .withMessage("Username must contain only letters and numbers")
    .notEmpty()
    .withMessage("Username is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

const validateTask = [
  body("task")
    .escape()
    .isString()
    .isLength({ min: 1, max: 255 })
    .withMessage("Task must be between 1 and 255 characters"),
];

module.exports = { validateRegister, validateLogin, validateTask };
