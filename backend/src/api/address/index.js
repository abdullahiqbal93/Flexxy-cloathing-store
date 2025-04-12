import { createAddress, deleteAddress, getAddress, getAddressById, updateAddress } from "@/api/address/controller.js";
import { insertAddressSchema, updateAddressSchema } from "@/api/address/schema/index.js";
import { validateRequestBody, validateRequestParams } from "@/lib/middlewares/validate.js";
import { addressByIdSchemaParams, getByIDSchemaParams, userByIdSchemaParams } from "@/lib/shared-schema/index.js";

export const address = (router) => {
    router.post(
      "/address",
      validateRequestBody(insertAddressSchema),
      createAddress
    );
  
    router.get("/address", getAddress); 
  
    router.get(
      "/address/:userId/:addressId",
      validateRequestParams(userByIdSchemaParams,addressByIdSchemaParams),
      getAddressById
    );
  
    router.put(
      "/address/:userId/:addressId",
      validateRequestParams(userByIdSchemaParams,addressByIdSchemaParams), 
      validateRequestBody(updateAddressSchema),
      updateAddress
    );
  
    router.delete(
      "/address/:userId/:addressId",
      validateRequestParams(userByIdSchemaParams,addressByIdSchemaParams),
      deleteAddress
    );
  
    return router;
  };