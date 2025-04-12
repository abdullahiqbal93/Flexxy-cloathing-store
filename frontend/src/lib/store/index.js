import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/lib/store/features/user/userSlice.js";
import adminUserReducer from "@/lib/store/features/user/adminUserSlice.js";
import searchReducer from "@/lib/store/features/search/searchSlice.js";
import productReducer from "@/lib/store/features/product/productSlice.js";
import cartReducer from "@/lib/store/features/cart/cartSlice.js";
import addressReducer from "@/lib/store/features/address/addressSlice.js";
import orderReducer from "@/lib/store/features/order/orderSlice.js";
import adminOrderReducer from "@/lib/store/features/order/adminOrderSlice.js";
import wishlistReducer from "@/lib/store/features/wishlist/wishlistSlice.js";
import newsletterReducer from "@/lib/store/features/newsletter/newsletterSlice.js";

import { usersApi } from "@/lib/store/api/userService.js";

export const makeStore = () => {
  return configureStore({
    reducer: {
      user: userReducer,
      adminUser: adminUserReducer,
      search: searchReducer,
      product: productReducer,
      cart: cartReducer,
      address: addressReducer,
      order: orderReducer,
      adminOrder: adminOrderReducer,
      wishlist: wishlistReducer,
      newsletter: newsletterReducer,
      [usersApi.reducerPath]: usersApi.reducer,
    },
    devTools: false,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        usersApi.middleware,
      ),
  });
};

const store = makeStore();

export default store;
