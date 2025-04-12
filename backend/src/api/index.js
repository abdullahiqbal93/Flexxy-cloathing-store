import { heartbeat } from "@/api/status/heartbeat.js";
import { user } from "@/api/user/index.js";
import { product } from "@/api/product/index.js";
import { cart } from "@/api/cart/index.js";
import { order } from "@/api/order/index.js";
import { address } from "@/api/address/index.js";
import { search } from "@/api/search/index.js";
import { wishlist } from "@/api/wishlist/index.js";
import { newsletter } from "@/api/newsletter/index.js";

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