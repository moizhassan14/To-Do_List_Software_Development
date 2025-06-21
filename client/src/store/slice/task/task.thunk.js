// File: client/src/store/slice/task/task.thunk.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../../components/utilities/axiosInstance";
import toast from "react-hot-toast";

// Helper function for error handling
const handleError = (error, defaultMessage) => {
  const msg = error?.response?.data?.error || defaultMessage;
  toast.error(msg);
  return msg;
};

// Thunk to create a task
export const createTaskThunk = createAsyncThunk(
  "task/create",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/tasks/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Task created successfully");
      return response.data;
    } catch (error) {
      return rejectWithValue(handleError(error, "Failed to create task"));
    }
  }
);

// Thunk to get user's tasks
export const getMyTasksThunk = createAsyncThunk(
  "task/getMyTasks",
  async (params = {}, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams(params).toString();
      const response = await axiosInstance.get(`/tasks/get-my-tasks?${query}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleError(error, "Failed to fetch tasks"));
    }
  }
);

// Thunk to update a task
export const updateTaskThunk = createAsyncThunk(
  "task/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/tasks/update/${id}`, data);
      toast.success("Task updated successfully");
      return response.data;
    } catch (error) {
      return rejectWithValue(handleError(error, "Failed to update task"));
    }
  }
);

// Thunk to delete a task
export const deleteTaskThunk = createAsyncThunk(
  "task/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/tasks/delete/${id}`);
      toast.success("Task deleted successfully");
      return id;
    } catch (error) {
      return rejectWithValue(handleError(error, "Failed to delete task"));
    }
  }
);

// Thunk to share a task
export const shareTaskThunk = createAsyncThunk(
  "task/share",
  async ({ taskId, userIdToShare }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/tasks/share/${taskId}`, {
        userIdToShare,
      });
      toast.success("Task shared successfully");
      return response.data;
    } catch (error) {
      return rejectWithValue(handleError(error, "Failed to share task"));
    }
  }
);

// Thunk to reorder tasks
export const reorderTasksThunk = createAsyncThunk(
  "task/reorder",
  async (reorderedTasks, { rejectWithValue }) => {
    try {
      const payload = reorderedTasks.map(({ _id, order }) => ({ _id, order }));
      const response = await axiosInstance.put("/tasks/reorder", {
        tasks: payload,
      });
      toast.success("Tasks reordered successfully");
      return response.data.tasks;
    } catch (error) {
      return rejectWithValue(handleError(error, "Failed to reorder tasks"));
    }
  }
);
