import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import {
  registerValidation,
  loginValidation,
} from "../middleware/validators/user.validator.js";

const router = Router();
router.post(
  "/register",
  registerValidation,
  userController.createUserController
);
router.post("/login", loginValidation, userController.loginController);

export default router;