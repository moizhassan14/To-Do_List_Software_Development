import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../../components/utilities/axiosInstance";
import toast from "react-hot-toast";

// loginThunk
export const loginUserThunk = createAsyncThunk(
  "users/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/users/login", {
        email,
        password,
      });
      return { success: true, ...response.data }; // Ensure success is included
    } catch (error) {
      console.error(error?.response?.data.message);
      const errorOutput = error?.response?.data.message;
      return rejectWithValue({ success: false, message: errorOutput });
    }
  }
);
//registerUserThunk
export const registerUserThunk = createAsyncThunk(
  "users/register",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/users/register", {
        email,
        password,
      });
      return { success: true, ...response.data }; // Ensure success is included
    } catch (error) {
      console.error(error?.response?.data.message);
      const errorOutput = error?.response?.data.message;
      return rejectWithValue(errorOutput);
    }
  }
);

// Logout Thunk
export const logOutUserThunk = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.post("/users/logout");
      toast.success("Logged out successfully");
      return true;
    } catch (error) {
      const errorMsg = error?.response?.data?.error || "Logout failed";
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

// Refresh Token Thunk
export const refreshTokenThunk = createAsyncThunk(
  "user/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/users/refresh-token");
      toast.success("Session refreshed");
      return response.data;
    } catch (error) {
      const errorMsg = error?.response?.data?.error || "Session expired";
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

// Get All Users by Role (Owner only)
export const getUsersByRoleThunk = createAsyncThunk(
  "user/getUsersByRole",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/users/roles");
      return response.data;
    } catch (error) {
      const errorMsg = error?.response?.data?.error || "Failed to fetch users";
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

// getOwnerDashboardThunk
export const getOwnerDashboardThunk = createAsyncThunk(
  "user/getOwnerDashboard",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/users/owner-dashboard");
      return res.data.message;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.error || "Owner dashboard access failed"
      );
    }
  }
);

// getSharedDashboardThunk
export const getSharedDashboardThunk = createAsyncThunk(
  "user/getSharedDashboard",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/users/shared-dashboard");
      return res.data.message;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.error || "Shared dashboard access failed"
      );
    }
  }
);

//only can assign roles
export const assignUserRoleThunk = createAsyncThunk(
  "user/assignUserRole",
  async ({ userId, role }, thunkAPI) => {
    try {
      const response = await axiosInstance.put(`/users/${userId}/role`, { role });
      return { userId, role, message: response.data.message };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.error || "Failed to assign role"
      );
    }
  }
);