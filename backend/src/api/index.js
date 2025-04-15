import { heartbeat } from "./status/heartbeat.js";
import { user } from "./user/index.js";
import { product } from "./product/index.js";
import { cart } from "./cart/index.js";
import { order } from "./order/index.js";
import { address } from "./address/index.js";
import { search } from "./search/index.js";
import { wishlist } from "./wishlist/index.js";
import { newsletter } from "./newsletter/index.js";

import { Router } from "express";

export const getApiRouter = () => {
    const router = Router();
    heartbeat(router);
    user(router);
    product(router);
    cart(router);
    order(router);
    address(router);
    search(router);
    wishlist(router);
    newsletter(router);

    return router;
};