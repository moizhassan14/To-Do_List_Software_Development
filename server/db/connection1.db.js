import mongoose from "mongoose";
import chalk from "chalk";

export const connectDB = async () => {
  try {
    const MONGODB_URL = process.env.MONGODB_URL;
    const instance = await mongoose.connect(MONGODB_URL);
    console.log(
      chalk.blue.bgGreen.bold(`MONGODB CONNECTED ${instance.connection.host}`)
    );
  } catch (error) {
    console.log(chalk.blue.bgRed.bold(error));
  }
};
