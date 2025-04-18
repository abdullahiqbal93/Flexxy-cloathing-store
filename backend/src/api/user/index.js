import { authenticatedUser, createUser, deleteUser, getUser, getUserById, loginUser, logoutUser, updateUser, updateUserPassword, requestPasswordReset, validateResetToken, resetPassword } from "./controller.js";
import { loginSchema, updateUserSchema, userSchema, requestPasswordResetSchema, validateResetTokenSchema, resetPasswordSchema, insertUserSchema } from "./schema/index.js";
import { createdByValues, updatedByValues } from "../../lib/middlewares/default-data.js";
import { userPasswordHashing, verifyUserToken } from "../../lib/middlewares/user-middleware.js";
import { validateRequestBody, validateRequestParams } from "../../lib/middlewares/validate.js";
import { getByIDSchemaParams } from "../../lib/shared-schema/index.js";

export const user = (router) => {
    router.post(
        "/user",
        validateRequestBody(insertUserSchema),
        userPasswordHashing,
        createdByValues,
        createUser,
    );

    router.get("/user", verifyUserToken, getUser);
    
    router.put(
        "/user/change-password",
        verifyUserToken,
        updateUserPassword
    );

    router.get("/user/:id", validateRequestParams(getByIDSchemaParams), getUserById);

    router.put(
        "/user/:id",
        validateRequestParams(getByIDSchemaParams),
        validateRequestBody(updateUserSchema),
        verifyUserToken,
        updatedByValues,
        updateUser,
    );

    router.delete("/user/:id", validateRequestParams(getByIDSchemaParams), verifyUserToken, deleteUser);

    router.post("/login", validateRequestBody(loginSchema), loginUser);

    router.post("/logout", logoutUser);

    router.get("/check-auth", verifyUserToken, authenticatedUser);

    router.post("/forgot-password", validateRequestBody(requestPasswordResetSchema), requestPasswordReset);

    router.post("/validate-reset-token", validateRequestBody(validateResetTokenSchema), validateResetToken);

    router.post("/reset-password", validateRequestBody(resetPasswordSchema), resetPassword);

    return router;
};