import mongoose from "mongoose";
import chalk from "chalk";

export const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URL;
    const instance = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(chalk.blue.bgGreen.bold(`MONGODB CONNECTED ${instance.connection.host}`));
  } catch (error) {
    console.log(chalk.blue.bgRed.bold(error));
  }
};

