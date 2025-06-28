// ✅ tests/integration/route.test.js (Fixed with Email Uniqueness Check & Proper Expectation)
import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });

import request from "supertest";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import app from "../../app.js";
import User from "../../models/user.model.js";
import Task from "../../models/task.model.js";

describe("Integration Test - Task and User Routes", () => {
  let token;
  let userId;
  let taskId;
  let isDbConnected = false;

  beforeAll(async () => {
    try {
      await mongoose.connect(process.env.MONGODB_URL);
      isDbConnected = true;

      const hashedPassword = await bcrypt.hash("testpass", 10);
      const user = await User.create({
        email: "testuser@example.com",
        password: hashedPassword,
        role: "owner",
      });

      userId = user._id;
      token = jwt.sign(
        { id: userId, role: user.role, email: user.email },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: "1h" }
      );
    } catch (err) {
      console.error("❌ Setup failed:", err);
    }
  });

  afterAll(async () => {
    if (isDbConnected) {
      await Task.deleteMany();
      await User.deleteMany();
      await mongoose.connection.close();
    }
  });

  describe("/tasks routes", () => {
    it("POST /tasks/create should create a task", async () => {
      const res = await request(app)
        .post("/tasks/create")
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "Task A", description: "Testing" });

      expect(res.statusCode).toBe(201);
      taskId = res.body._id;
    });

    it("GET /tasks/get-my-tasks should fetch user tasks", async () => {
      const res = await request(app)
        .get("/tasks/get-my-tasks")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.tasks)).toBe(true);
    });

    it("PUT /tasks/update/:id should update task", async () => {
      const res = await request(app)
        .put(`/tasks/update/${taskId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "Updated Task" });

      expect(res.statusCode).toBe(200);
    });

    it("PUT /tasks/reorder should reorder tasks", async () => {
      const res = await request(app)
        .put("/tasks/reorder")
        .set("Authorization", `Bearer ${token}`)
        .send({ tasks: [{ _id: taskId, order: 1 }] });

      expect(res.statusCode).toBe(200);
    });

    it("DELETE /tasks/delete/:id should delete task", async () => {
      const res = await request(app)
        .delete(`/tasks/delete/${taskId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
    });
  });

  describe("/users routes", () => {
    let newUserId;

    it("POST /users/register should register a new user", async () => {
      const email = `newuser_${Date.now()}@example.com`; // ensure unique
      const res = await request(app).post("/users/register").send({
        email,
        password: "newpass12345",
      });

      expect(res.statusCode).toBe(201);
      expect(res.body.user).toHaveProperty("email", email);
      newUserId = res.body.user._id;
    });

    it("POST /users/login should login user", async () => {
      const res = await request(app).post("/users/login").send({
        email: "testuser@example.com",
        password: "testpass",
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.user).toHaveProperty("email", "testuser@example.com");
    });

    it("GET /users/roles should return list of users", async () => {
      const res = await request(app)
        .get("/users/roles")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("owners");
      expect(res.body).toHaveProperty("collaborators");
    });

    it("PUT /users/:id/role should assign a role", async () => {
      const res = await request(app)
        .put(`/users/${newUserId}/role`)
        .set("Authorization", `Bearer ${token}`)
        .send({ role: "collaborator" });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Role updated to collaborator");
    });

    it("GET /users/owner-dashboard should work", async () => {
      const res = await request(app)
        .get("/users/owner-dashboard")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
    });

    it("GET /users/shared-dashboard should work", async () => {
      const res = await request(app)
        .get("/users/shared-dashboard")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
    });
  });
});
