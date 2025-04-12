import { searchProducts } from "@/api/search/controller.js";

export const search = (router) => {
    router.get(
        "/search/:keyword",
        searchProducts
    )


    return router;
};