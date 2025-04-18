import { getApiRouter } from '../api/index.js';
import { getOpenApiRouter } from "../api/docs/open-api.js";
import { API_PATH, SWAGGER_PATH, env } from '../lib/config.js';
import { morganMiddleware } from '../lib/logger/morgan.js';
import { mainLogger } from '../lib/logger/winston.js';
import { expressErrorHandler } from "../lib/services/error.js";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { StatusCodes } from 'http-status-codes';
import morgan from 'morgan';
// import { loginRateLimiter } from './middlewares/user-middleware';


morgan.token("body", (req) => {
  try {
    return JSON.stringify(req.body);
  } catch (e) {
    mainLogger.error(e);
    return req.body;
  }
});

export const getServer = () => {
  const app = express();

  app.use(express.urlencoded({ extended: true }));
  app.use(cors({
    origin: env.CLIENT_BASE_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));
  
  app.use(express.json());
  app.use(cookieParser());
  app.use(helmet());

  // app.use(loginRateLimiter);
  // app.set("trust proxy", 1);

  app.use(morganMiddleware);
  app.use(API_PATH, getApiRouter());
  app.use(API_PATH + SWAGGER_PATH, getOpenApiRouter());

  app.get("/favicon.ico", (_, res) => res.status(StatusCodes.NO_CONTENT).send());

  app.get("/", (_, res) => {
    res.status(200).send({
      success: true,
      message: "Server is running",
      apiList: [
        {
          name: "API",
          endpoints: [
            {
              name: "API Status",
              url: `${env.API_BASE_URL}/heartbeat`,
            },
            {
              name: "User",
              url: `${env.API_BASE_URL}/user`,
            },
            {
              name: "Product",
              url: `${env.API_BASE_URL}/product`,
            },
            {
              name: "Cart",
              url: `${env.API_BASE_URL}/cart`,
            },
            {
              name: "Address",
              url: `${env.API_BASE_URL}/address`,
            },
            {
              name: "Order",
              url: `${env.API_BASE_URL}/order`,
            },
            {
              name: "Newsletter",
              url: `${env.API_BASE_URL}/newsletter`,
            },
          ],
        },
        {
          name: "Swagger",
          url: `${env.API_BASE_URL}/${SWAGGER_PATH}`,
        },
      ],
    });
  });

  app.all("*", function (_, res) {
    res.status(StatusCodes.NOT_FOUND).send({
      success: false,
      message: "404",
    });
  });

  app.use(expressErrorHandler);

  return app;
};
