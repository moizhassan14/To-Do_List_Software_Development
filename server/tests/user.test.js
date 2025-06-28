import request from "supertest";
import app from "../app.js";
import mongoose from "mongoose";
import userModel from "../models/user.model.js";
import { connectDB } from "../db/connection1.db.js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

let token;
let userId;

beforeAll(async () => {
  if (!process.env.MONGODB_URL) {
    console.error("❌ MONGODB_URL not set in environment variables.");
    process.exit(1);
  }

  await connectDB();
  await userModel.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("User APIs", () => {
  it("should register a new user", async () => {
    const res = await request(app).post("/users/register").send({
      email: "testuser@example.com",
      password: "testpass",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.user).toHaveProperty("email", "testuser@example.com");

    userId = res.body.user._id;

    // ✅ Promote to owner BEFORE login to ensure JWT has correct role
    await userModel.findByIdAndUpdate(userId, { role: "owner" });
  });

  it("should login user with correct credentials", async () => {
    const res = await request(app).post("/users/login").send({
      email: "testuser@example.com",
      password: "testpass",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.user).toHaveProperty("email", "testuser@example.com");

    // ✅ Extract token from set-cookie
    token = res.headers["set-cookie"]?.find((cookie) =>
      cookie.startsWith("accessToken")
    );
  });

  it("should get list of users (owner only)", async () => {
    const bearer = token?.split("=")[1].split(";")[0];

    const res = await request(app)
      .get("/users/roles")
      .set("Authorization", `Bearer ${bearer}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("owners");
    expect(res.body).toHaveProperty("collaborators");
  });

  it("should assign role to user", async () => {
    const newUser = await request(app).post("/users/register").send({
      email: "collab@example.com",
      password: "testpass",
    });

    const newUserId = newUser.body.user._id;
    const bearer = token?.split("=")[1].split(";")[0];

    const res = await request(app)
      .put(`/users/${newUserId}/role`)
      .send({ role: "collaborator" })
      .set("Authorization", `Bearer ${bearer}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toContain("Role updated to collaborator");
  });

  it("should logout user", async () => {
    const bearer = token?.split("=")[1].split(";")[0];

    const res = await request(app)
      .post("/users/logout")
      .set("Authorization", `Bearer ${bearer}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Logged out successfully");
  });

  it("should not refresh token with no token", async () => {
    const res = await request(app).post("/users/refresh-token");
    expect(res.statusCode).toBe(401);
  });
});
