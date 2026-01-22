import mongoose from "mongoose";
import { DB_NAME } from "../helpers/constants.js";

export const connectDB = async function () {
  try {
    const dbInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(`db connected successfully HOST:${dbInstance.connection.host}`);
  } catch (error) {
    console.log("failed connecting to db", error);
    process.exit(1);
  }
};
