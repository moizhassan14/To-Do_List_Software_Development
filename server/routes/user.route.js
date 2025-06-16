import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import {
  registerValidation,
  loginValidation,
} from "../middleware/validators/user.validator.js";
import { loginLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.post("/register", registerValidation, userController.createUserController);
router.post("/login", loginLimiter, loginValidation, userController.loginController);
router.post("/logout", userController.logoutController);
router.post("/refresh-token", userController.refreshTokenController);

export default router;
