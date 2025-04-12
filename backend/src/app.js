import { init } from "./lib/init.js";
import { mainLogger } from "./lib/logger/winston.js";
import { welcome } from "./lib/welcome.js";

process.on("unhandledRejection", (...reason) => {
  mainLogger.error("Unhandled Rejection at:", reason);
});

init()
  .then(() => {
    mainLogger.info(welcome());
  })
  .catch((e) => {
    mainLogger.error("Application start error", e);
  });
