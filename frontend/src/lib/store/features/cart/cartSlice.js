import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { invalidateUser, logoutUser } from "../user/userSlice";
import { getAxiosWithToken } from "@/lib/axios/axios";

const initialState = {
  cartItems: [],
  isLoading: false,
};

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, productId, quantity, size, color }, { rejectWithValue }) => {
    try {
      const axiosInstance = await getAxiosWithToken();
      const response = await axiosInstance.post("/cart", {
        userId,
        productId,
        quantity,
        size,
        color,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add to cart");
    }
  }
);

export const fetchUserCartItems = createAsyncThunk(
  "cart/fetchUserCartItems",
  async (userId, { rejectWithValue }) => {
    try {
      const axiosInstance = await getAxiosWithToken();
      const response = await axiosInstance.get(`/cart/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch cart items");
    }
  }
);

export const updateCartItemQuantity = createAsyncThunk(
  "cart/updateCartItemQuantity",
  async ({ userId, productId, size, color, quantity }, { rejectWithValue }) => {
    try {
      const axiosInstance = await getAxiosWithToken();
      const response = await axiosInstance.put("/cart", {
        userId,
        productId,
        size,
        color,
        quantity,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update cart");
    }
  }
);

export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async ({ userId, productId, size, color }, { rejectWithValue }) => {
    try {
      const axiosInstance = await getAxiosWithToken();
      const response = await axiosInstance.delete("/cart", {
        data: { userId, productId, size, color },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete cart item");
    }
  }
);

const cartSlice = createSlice({
  name: "cartSlice",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cartItems = [];
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(addToCart.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      .addCase(fetchUserCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(fetchUserCartItems.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      .addCase(updateCartItemQuantity.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(updateCartItemQuantity.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      .addCase(deleteCartItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(deleteCartItem.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      .addCase(invalidateUser, (state) => {
        state.cartItems = [];
        state.isLoading = false;
      })
      .addCase(logoutUser, (state) => {
        state.cartItems = [];
        state.isLoading = false;
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
