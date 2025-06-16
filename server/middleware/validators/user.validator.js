import { body } from "express-validator";

export const registerValidation = [
  body("email")
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
    .trim()
    .escape(),
];

export const loginValidation = [
  body("email")
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail(),
  body("password")
    .notEmpty().withMessage("Password is required")
    .trim()
    .escape(),
];
