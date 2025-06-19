import axios from "axios";
import {store} from "../../store/store.js";
import {
  refreshTokenThunk,
  logOutUserThunk,
} from "../../store/slice/user/user.thunk.js";
import toast from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // ensures cookies (access/refresh tokens) are sent
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const status = error?.response?.status;
    const errorMessage = error?.response?.data?.error;

    const isAccessTokenIssue =
      (status === 401 &&
        [
          "Unauthorized: No token provided",
          "Token expired",
          "Invalid token",
        ].includes(errorMessage)) ||
      (status === 403 && errorMessage === "Token is blacklisted");

    if (isAccessTokenIssue && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await store.dispatch(refreshTokenThunk()).unwrap(); // refresh tokens
        return axiosInstance(originalRequest); // retry original request
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        toast.error("Session expired. Please log in again.");
        store.dispatch(logOutUserThunk());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
