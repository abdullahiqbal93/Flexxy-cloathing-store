import { API_PATH, SWAGGER_PATH, env } from './config.js';
import { mainLogger } from './logger/winston.js';
import { connectDB } from './mongo/db.js';
import { getServer } from './server.js';
import { config } from 'dotenv';
import { initializeEmailTransporter } from './utils/email.js';

config();

export const init = async () => {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const db = await connectDB(env.DB_URI);

        if (db) {
          await initializeEmailTransporter();
          const app = getServer();

          app.listen(env.PORT, () => {
            mainLogger.info(`Server running on ${env.API_BASE_URL}`);
            mainLogger.info(`API Status: ${env.API_BASE_URL}/heartbeat`);
            mainLogger.info(`Swagger Documentation: ${env.API_BASE_URL}/${SWAGGER_PATH}`);
          });
          resolve("DB connected");
        } else {
          reject("DB connection failed");
        }
      } catch (e) {
        reject({ message: "Cannot connect to the database", ...e });
        mainLogger.error({ message: "Cannot start the server" });
      }
    })();
  });
};


