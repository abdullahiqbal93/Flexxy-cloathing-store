import mongoose from "mongoose";
import { mainLogger } from "../logger/winston.js";

export const connectDB = async (db) => {
  try {
    if (!db) {
      throw new Error("Database URL is not provided");
    }
    mainLogger.info(`Connecting to MongoDB at ${db.split("@")[1]}`);
    const connection = await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    mainLogger.info("MongoDB connection established successfully");
    return connection;
  } catch (error) {
    mainLogger.error("MongoDB connection error:", error.message);
    throw error;
  }
};
