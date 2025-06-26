// File: routes/task.routes.js
import { Router } from "express";
import { upload } from "../config/multer.config.js";
import { authUser } from "../middleware/auth.middleware.js";
import * as taskController from "../controllers/task.controller.js";
import { createOrUpdateTaskValidation } from "../middleware/validators/task.validator.js";

const router = Router();

router.post(
  "/create",
  authUser,
  upload.array("attachments"), // ✅ This now uses correct filename logic
  createOrUpdateTaskValidation,
  taskController.createTaskController
);
router.get("/get-my-tasks", authUser, taskController.getMyTasksController);
router.put(
  "/update/:id",
  authUser,
  createOrUpdateTaskValidation,
  taskController.updateTaskController
);
router.delete("/delete/:id", authUser, taskController.deleteTaskController);
router.post("/share/:taskId", authUser, taskController.shareTaskController);
router.put("/reorder", authUser, taskController.reorderTasksController);

export default router;
