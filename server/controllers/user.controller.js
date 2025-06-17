// controllers/user.controller.js
import { validationResult } from "express-validator";
import userModel from "../models/user.model.js";
import * as userService from "../services/user.service.js";
import { generateTokens } from "../utils/token.js";
import redisClient from "../services/redis.service.js";
import jwt from "jsonwebtoken";

export const createUserController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const user = await userService.createUser(req.body);
    const { accessToken, refreshToken } = generateTokens(user);
    delete user._doc.password;

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000, // 15 minutes
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(201).json({ user });
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

export const loginController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ errors: "Invalid credentials" });
    }
    const isMatch = await user.isValidPassword(password);
    if (!isMatch) {
      return res.status(401).json({ errors: "Invalid credentials" });
    }
    const { accessToken, refreshToken } = generateTokens(user);
    delete user._doc.password;

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

export const logoutController = async (req, res) => {
  try {
    const accessToken = req.cookies.accessToken || req.headers?.authorization?.split(" ")[1];
    const refreshToken = req.cookies.refreshToken;

    if (accessToken) {
      await redisClient.set(accessToken, "blacklisted", "EX", 60 * 60 * 24);
    }
    if (refreshToken) {
      await redisClient.set(refreshToken, "blacklisted", "EX", 60 * 60 * 24 * 7);
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const refreshTokenController = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ error: "No refresh token provided" });
  }

  try {
    const blacklisted = await redisClient.get(refreshToken);
    if (blacklisted) {
      return res.status(403).json({ error: "Token is blacklisted" });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

    // Blacklist the old refresh token
    await redisClient.set(refreshToken, "blacklisted", "EX", 60 * 60 * 24 * 7);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Token refreshed" });
  } catch (error) {
    console.error("Refresh error:", error.message);
    res.status(403).json({ error: "Invalid or expired refresh token" });
  }
};

export const assignRoleController = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  const validRoles = ["owner", "collaborator"];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }

  try {
    const user = await userModel.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    );

    if (!user) return res.status(404).json({ error: "User not found" });

    return res.status(200).json({ message: `Role updated to ${role}` });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
};

export const getUsersByRoleController = async (req, res) => {
  try {
    const users = await userModel.find({}, "email role createdAt").sort({ role: 1 });

    const groupedUsers = {
      owners: users.filter(user => user.role === "owner"),
      collaborators: users.filter(user => user.role === "collaborator"),
    };

    res.status(200).json(groupedUsers);
  } catch (err) {
    console.error("Error fetching users by role:", err);
    res.status(500).json({ error: "Server error while fetching users" });
  }
};