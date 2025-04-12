import morgan from "morgan";
import { logFormat, streamFunc } from "@/lib/logger/helper.js";
import { env } from "@/lib/config.js";

export const morganMiddleware = morgan(logFormat, {
  stream: streamFunc(),
  skip: () => env.NODE_ENV === "test"
}
);

