import express from "express";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./db/connection1.db.js";
import userRouter from "./routes/user.route.js";
import { apiRateLimiter } from "./middleware/rateLimiter.js";
import cookieParser from "cookie-parser";
import taskRouter from "./routes/task.route.js";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB();
const app = express();

app.use(morgan("dev"));
app.use(cors({
    origin: process.env.CLIENT_URL, // Your frontend URL
    credentials: true
  }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve uploaded files
// Apply rate limiting globally
app.use(apiRateLimiter);

//Routes
app.use("/users", userRouter);
app.use("/tasks", taskRouter);

export default app;
