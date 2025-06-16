import express from "express";
import morgan from "morgan";
import { connectDB } from "./db/connection1.db.js";
import userRouter from "./routes/user.route.js";
import { apiRateLimiter } from "./middleware/rateLimiter.js";
import cookieParser from "cookie-parser";

connectDB();
const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// Apply rate limiting globally
app.use(apiRateLimiter);


//Routes
app.use("/users",userRouter)

export default app;
