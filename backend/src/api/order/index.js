import { addOrder, cancelOrder, capturePayment, createOrder, deleteOrder, deleteOrderForAdmin, deleteOrderForUser, getOrder, getOrderById, updateOrder } from "@/api/order/controller.js";
import { insertOrderSchema, updateOrderSchema } from "@/api/order/schema/index.js";
import { validateRequestBody, validateRequestParams } from "@/lib/middlewares/validate.js";
import { getByIDSchemaParams } from "@/lib/shared-schema/index.js";

export const order = (router) => {
    router.post(
        "/order",
        validateRequestBody(insertOrderSchema), 
        createOrder,
    );

    router.post(
        "/add-order",
        validateRequestBody(insertOrderSchema), 
        addOrder,
    );

    router.post("/order/capture", capturePayment);

    router.get("/order", getOrder);

    router.get("/order/:id", validateRequestParams(getByIDSchemaParams), getOrderById);

    router.put(
        "/order/:id",
        validateRequestParams(getByIDSchemaParams),
        validateRequestBody(updateOrderSchema),
        updateOrder,
    );

    router.put("/order/delete/:id", validateRequestParams(getByIDSchemaParams), deleteOrderForUser);

    router.put("/order/admin-delete/:id", validateRequestParams(getByIDSchemaParams), deleteOrderForAdmin);

    router.delete("/order/:id", validateRequestParams(getByIDSchemaParams), deleteOrder);

    router.post(
        "/order/cancel/:id", 
        validateRequestParams(getByIDSchemaParams), 
        cancelOrder
      );

    return router;
};