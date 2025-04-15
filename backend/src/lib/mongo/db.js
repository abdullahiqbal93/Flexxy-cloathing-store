import mongoose from "mongoose";
import { mainLogger } from "../../lib/logger/winston.js";

let cachedConnection = null;

export const connectDB = async (db) => {
  try {
    if (!db) {
      throw new Error("Database URL is not provided");
    }

    if (cachedConnection) {
      mainLogger.info("Using cached MongoDB connection");
      return cachedConnection;
    }

    mainLogger.info(`Connecting to MongoDB at ${db.split("@")[1]}`);
    
    const connection = await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
      socketTimeoutMS: 45000,
      family: 4
    });

    cachedConnection = connection;
    mainLogger.info("MongoDB connection established successfully");
    return connection;
  } catch (error) {
    mainLogger.error("MongoDB connection error:", error.message);
    throw error;
  }
};
