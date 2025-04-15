import morgan from "morgan";
import { logFormat, streamFunc } from "./helper.js";
import { env } from "../config.js";

export const morganMiddleware = morgan(logFormat, {
  stream: streamFunc(),
  skip: () => env.NODE_ENV === "test"
}
);

