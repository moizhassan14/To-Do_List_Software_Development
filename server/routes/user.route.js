import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import {
  registerValidation,
  loginValidation,
} from "../middleware/validators/user.validator.js";
import { loginLimiter } from "../middleware/rateLimiter.js";
import { authUser } from "../middleware/auth.middleware.js";
import { authorizeRole } from "../middleware/authorizeRole.js";

const router = Router();

//Public routes
router.post(
  "/register",
  registerValidation,
  userController.createUserController
);
router.post(
  "/login",
  loginLimiter,
  loginValidation,
  userController.loginController
);
router.post("/logout", userController.logoutController);
router.post("/refresh-token", userController.refreshTokenController);

// Owner-only dashboard route
router.get("/owner-dashboard", authUser, authorizeRole("owner"), (req, res) => {
  res.status(200).json({ message: `${req.user.role}: ${req.user.email}` });
});
// Shared dashboard (owner or collaborator)
router.get(
  "/shared-dashboard",
  authUser, // checks if user is logged in
  authorizeRole("owner", "collaborator"),
  (req, res) => {
    res
      .status(200)
      .json({ message: `Hello ${req.user.role}: ${req.user.email}` });
  }
);
// Only owner can assign roles to other users
router.put(
  "/:id/role",
  authUser, // checks if user is logged in
  authorizeRole("owner"), // allows only 'owner'
  userController.assignRoleController
);
// only owner retrieve the users
router.get(
  "/roles",
  authUser, // checks if user is logged in
  authorizeRole("owner"), // allows only 'owner'
  userController.getUsersByRoleController
);

export default router;
