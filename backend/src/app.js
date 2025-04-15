import { init } from "./lib/init.js";
import { mainLogger } from "./lib/logger/winston.js";
import { welcome } from "./lib/welcome.js";
import { getServer } from "./lib/server.js";

process.on("unhandledRejection", (...reason) => {
  mainLogger.error("Unhandled Rejection at:", reason);
});

// Initialize the database connection when not in a serverless environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  init()
    .then(() => {
      mainLogger.info(welcome());
    })
    .catch((e) => {
      mainLogger.error("Application start error", e);
    });
}

// Export the Express app for serverless functions
const app = getServer();
export default app;
