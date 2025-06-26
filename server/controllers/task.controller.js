// File: controllers/task.controller.js
import Task from "../models/task.model.js";
import { validationResult } from "express-validator";

export const createTaskController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const taskData = {
      ...req.body,
      owner: req.user.id,
      attachments: req.files?.map((file) => ({
        fileName: file.originalname,
        filePath: `uploads/${file.filename}`,
      })),
    };

    const task = await Task.create(taskData);
    res.status(201).json(task);
  } catch (err) {
    console.error("[Create Task Error]", err);
    res.status(500).json({ error: "Failed to create task" });
  }
};

export const getMyTasksController = async (req, res) => {
  try {
    const filter = {
      $or: [
        { owner: req.user.id },
        { sharedWith: req.user.id },
      ],
    };

    if (req.query.status === "active") filter.isCompleted = false;
    if (req.query.status === "completed") filter.isCompleted = true;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [tasks, total] = await Promise.all([
      Task.find(filter).sort({ order: 1, createdAt: -1 }).skip(skip).limit(limit),
      Task.countDocuments(filter),
    ]);

    res.status(200).json({
      tasks,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("[Get Tasks Error]", err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

export const updateTaskController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { id } = req.params;
  try {
    const task = await Task.findOneAndUpdate(
      { _id: id, owner: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ error: "Task not found or unauthorized" });

    res.status(200).json(task);
  } catch (err) {
    console.error("[Update Task Error]", err);
    res.status(500).json({ error: "Failed to update task" });
  }
};

export const deleteTaskController = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
    if (!task) return res.status(404).json({ error: "Task not found or unauthorized" });

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("[Delete Task Error]", err);
    res.status(500).json({ error: "Failed to delete task" });
  }
};

export const shareTaskController = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { userIdToShare } = req.body;

    if (!userIdToShare) {
      return res.status(400).json({ error: "User ID to share with is required" });
    }

    const task = await Task.findById(taskId);
    if (!task || task.owner.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to share this task" });
    }

    if (task.sharedWith.includes(userIdToShare)) {
      return res.status(400).json({ error: "Task already shared with this user" });
    }

    task.sharedWith.push(userIdToShare);
    await task.save();

    res.status(200).json({ message: "Task shared successfully" });
  } catch (err) {
    console.error("[Share Task Error]", err);
    res.status(500).json({ error: "Failed to share task" });
  }
};

export const reorderTasksController = async (req, res) => {
  try {
    const updates = req.body.tasks; // Array of {_id, order}

    // Validate input
    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ error: "No tasks provided for reordering" });
    }

    for (const item of updates) {
      if (!item._id || typeof item.order !== "number") {
        return res.status(400).json({ error: "Invalid task data provided" });
      }
    }

    const bulkOps = updates.map(({ _id, order }) => ({
      updateOne: {
        filter: { _id, owner: req.user.id },
        update: { $set: { order } },
      },
    }));

    await Task.bulkWrite(bulkOps);

    const reorderedTasks = await Task.find({
      $or: [{ owner: req.user.id }, { sharedWith: req.user.id }],
    }).sort({ order: 1, createdAt: -1 });

    res.status(200).json({ tasks: reorderedTasks });
  } catch (err) {
    console.error("[Reorder Tasks Error]", err);
    res.status(500).json({ error: "Failed to reorder tasks" });
  }
};
