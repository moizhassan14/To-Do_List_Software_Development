// File: middleware/validators/task.validator.js
import { body } from "express-validator";

export const createOrUpdateTaskValidation = [
  body("title")
    .optional()
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be 3–100 characters"),

  body("description").optional().isLength({ max: 500 }),
  body("notes").optional().isLength({ max: 1000 }),
  body("dueDate").optional().isISO8601().withMessage("Invalid due date"),
  body("priority").optional().isIn(["low", "medium", "high"]),
  body("tags").optional().isArray(),
  body("isCompleted").optional().isBoolean(),
  body("order").optional().isNumeric(),
];