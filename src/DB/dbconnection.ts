import mongoose from "mongoose";
import { env } from "../config/envConfig.js";

export const connectDB = async () => {
  const MONGO_URI = env.MONGODB_URI;

  try {
    await mongoose.connect(MONGO_URI);
  } catch (error) {
    process.exit(1);
  }
};