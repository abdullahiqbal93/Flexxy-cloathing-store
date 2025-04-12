import { addToCart, deleteCartItem, fetchUserCartItems, updateCartItemQuantity } from "@/api/cart/controller.js";
import { deleteCartSchema, insertCartSchema, updateCartSchema } from "@/api/cart/schema/index.js";
import { validateRequestBody } from "@/lib/middlewares/validate.js";

export const cart = (router) => {
    router.post(
        "/cart",
        validateRequestBody(insertCartSchema),
        addToCart,
    );

    router.get("/cart/:userId", fetchUserCartItems);

    router.put(
        "/cart",
        validateRequestBody(updateCartSchema),
        updateCartItemQuantity,
    );

    router.delete("/cart", validateRequestBody(deleteCartSchema), deleteCartItem);

    return router;
};