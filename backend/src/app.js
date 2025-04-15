import { init } from "./lib/init.js";
import { mainLogger } from "./lib/logger/winston.js";
import { welcome } from "./lib/welcome.js";
import { getServer } from "./lib/server.js";
import { connectDB } from "./lib/mongo/db.js";
import { env } from "./lib/config.js";
import { initializeEmailTransporter } from "./lib/utils/email.js";

process.on("unhandledRejection", (...reason) => {
  mainLogger.error("Unhandled Rejection at:", reason);
});

// Initialize database connection and email transporter
const initializeServices = async () => {
  try {
    const db = await connectDB(env.DB_URI);
    if (db) {
      await initializeEmailTransporter();
      mainLogger.info(welcome());
      return true;
    }
    return false;
  } catch (error) {
    mainLogger.error("Service initialization error:", error);
    throw error; // Propagate the error for better handling
  }
};

// Initialize services for both development and production
await initializeServices();

// Export the Express app for serverless functions
const app = getServer();

// Add error handling middleware for serverless environment
app.use((err, req, res, next) => {
  mainLogger.error('Serverless error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });
  
  // Handle MongoDB connection errors specifically
  if (err.name === 'MongoError' || err.name === 'MongooseError') {
    return res.status(500).json({
      success: false,
      message: 'Database connection error',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Please try again later'
    });
  }

  // Handle other errors
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

export default app;
