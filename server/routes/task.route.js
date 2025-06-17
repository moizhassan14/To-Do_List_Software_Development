// File: routes/task.routes.js
import { Router } from "express";
import multer from "multer";
import { authUser } from "../middleware/auth.middleware.js";
import * as taskController from "../controllers/task.controller.js";
import { createOrUpdateTaskValidation } from "../middleware/validators/task.validator.js";

const router = Router();
const upload = multer({ dest: "uploads/" });

router.post("/create", authUser, upload.array("attachments"), createOrUpdateTaskValidation, taskController.createTaskController);
router.get("/get-my-tasks", authUser, taskController.getMyTasksController);
router.put("/update/:id", authUser, createOrUpdateTaskValidation, taskController.updateTaskController);
router.delete("/delete/:id", authUser, taskController.deleteTaskController);
router.post("/share/:taskId", authUser, taskController.shareTaskController);

export default router;
