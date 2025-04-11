import morgan from "morgan";
import { logFormat, streamFunc } from "@/lib/logger/helper";
import { env } from "@/lib/config";

export const morganMiddleware = morgan(logFormat, {
  stream: streamFunc(),
  skip: () => env.NODE_ENV === "test"
}
);

