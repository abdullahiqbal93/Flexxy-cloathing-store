import { API_PATH, SWAGGER_PATH, env } from "./config.js";
import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { getAuthDetails } from "./utils/swagger-doc.js";
import { getHeartBeatRegistry } from "../api/status/heartbeat.js";
import { getUserRegistry } from "../api/user/docs.js";
import { getProductRegistry} from "../api/product/docs.js";
import { getCartRegistry } from "../api/cart/docs.js";
import { getOrderRegistry } from "../api/order/docs.js";
import { getAddressRegistry } from "../api/address/docs.js";
import { getNewsletterRegistry } from "../api/newsletter/docs.js";


export const generateOpenAPIDocument = async () => {
  const registry = new OpenAPIRegistry([
    getHeartBeatRegistry(),
    getUserRegistry(),
    getProductRegistry(),
    getCartRegistry(),
    getOrderRegistry(),
    getAddressRegistry(),
    getNewsletterRegistry()
  ]);

  const authDetails = await getAuthDetails(registry);

  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      version: "v1",
      title: "Flexxy API",
    },
    servers: [{ url: `${env.API_BASE_URL}` }],
    externalDocs: {
      description: "View the raw OpenAPI Specification in JSON format",
      url: `${API_PATH}${SWAGGER_PATH}/json`,
    },
    security: authDetails.security,
    components: authDetails.components,
  });
};