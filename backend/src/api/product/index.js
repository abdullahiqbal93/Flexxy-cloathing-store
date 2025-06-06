import { addReview, createProduct, deleteProduct, deleteReview, generateProductDescription, getBrands, getFilteredProducts, getProduct, getProductById, handleImageUpload, updateProduct, updateReview } from "./controller.js";
import { insertProductSchema, updateProductSchema } from "./schema/index.js";
import { validateRequestBody, validateRequestParams } from "../../lib/middlewares/validate.js";
import { getByIDSchemaParams } from "../../lib/shared-schema/index.js";
import multer from "multer";

const upload = multer();

export const product = (router) => {
    router.post(
        "/product",
        upload.array("images", 5),
        validateRequestBody(insertProductSchema),
        createProduct,
    );

    router.post('/upload-image', upload.array("images"), handleImageUpload);

    router.get("/product", getProduct);

    router.get("/filtered-products", getFilteredProducts);

    router.get("/product/brand", getBrands);

    router.get("/product/:id", validateRequestParams(getByIDSchemaParams), getProductById);

    router.put(
        "/product/:id",
        validateRequestParams(getByIDSchemaParams),
        validateRequestBody(updateProductSchema),
        upload.array("images", 5),
        updateProduct,
    );

    router.delete("/product/:id", validateRequestParams(getByIDSchemaParams), deleteProduct);

    router.post("/product/:productId/review", addReview);

    router.put("/product/:productId/review/:reviewId", updateReview);
      router.delete("/product/:productId/review/:reviewId", deleteReview);

    router.post("/product/generate-description", generateProductDescription);

    return router;
};