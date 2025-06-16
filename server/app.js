import express from "express";
import morgan from "morgan";
import { connectDB } from "./db/connection1.db.js";
import userRouter from "./routes/user.route.js";


connectDB();
const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//Routes
app.use("/users",userRouter)

export default app;
