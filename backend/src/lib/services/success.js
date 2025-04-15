import { APIResponse, ResponseSchema } from "../response/response.js";
import { StatusCodes } from "http-status-codes";
import { mainLogger } from "../logger/winston.js";

function createSuccessResponseForSwagger(data) {
  return {
    [StatusCodes.OK]: {
      description: "Success response",
      content: {
        "application/json": {
          schema: ResponseSchema(data),
        },
      },
    },
  };
}

function createSuccessResponse(res, data, status = StatusCodes.OK, message = "Success") {
  mainLogger.info(`Success response sent: ${message}`);
  return res.status(status).send(APIResponse.success(message, data, status));
}

export { createSuccessResponseForSwagger, createSuccessResponse };