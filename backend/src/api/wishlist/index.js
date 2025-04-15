import { addToWishlist, removeFromWishlist, getUserWishlist } from "./controller.js";
import { validateRequestBody, validateRequestParams } from "../../lib/middlewares/validate.js";
import { wishlistSchema, updateWishlistSchema } from "./schema/index.js";
import { userByIdSchemaParams } from "../../lib/shared-schema/index.js";

export const wishlist = (router) => {
  router.post(
    "/wishlist",
    validateRequestBody(wishlistSchema),
    addToWishlist
  );

  router.delete(
    "/wishlist",
    validateRequestBody(updateWishlistSchema),
    removeFromWishlist
  );

  router.get(
    "/wishlist/:userId",
    validateRequestParams(userByIdSchemaParams),
    getUserWishlist
  );

  return router;
};