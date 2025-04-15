import * as fs from "node:fs/promises";
import { env } from "../../config.js";
import { JWTError } from "./error-handle.js";
import { mainLogger } from "../logger/winston.js";

export const getPKCS8PrivateKey = async () => {
  try {
    return await fs.readFile(env.PRIVATE_KEY_PATH, "utf8");
  } catch (error) {
    mainLogger.error("Error reading private key:", error);
    throw new JWTError("Error reading private key");
  }
};

