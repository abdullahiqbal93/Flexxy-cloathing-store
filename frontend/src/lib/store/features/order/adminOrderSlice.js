import { getAxiosWithToken } from "@/lib/axios/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  orderList: [],
  orderDetails: null,
  isLoading: false,
};

export const getAllOrdersForAdmin = createAsyncThunk(
  "/order/getAllOrdersForAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const axiosInstance = await getAxiosWithToken();
      const response = await axiosInstance.get(`/order`);
      const orders = response.data.data;

      const ordersWithUsers = await Promise.all(
        orders.map(async (order) => {
          try {
            const userRes = await axiosInstance.get(`/user/${order.userId}`);
            return { ...order, user: userRes.data.data };
          } catch {
            return { ...order, user: null };
          }
        })
      );

      return { data: ordersWithUsers };
    } catch (err) {
      return rejectWithValue(err.response?.data || "Fetching orders failed");
    }
  }
);

export const getOrderDetailsForAdmin = createAsyncThunk(
  "/order/getOrderDetailsForAdmin",
  async (id, { rejectWithValue }) => {
    try {
      const axiosInstance = await getAxiosWithToken();
      const response = await axiosInstance.get(`/order/${id}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Fetching order details failed");
    }
  }
);

export const deleteOrder = createAsyncThunk(
  "/order/deleteOrder",
  async (id, { rejectWithValue }) => {
    try {
      const axiosInstance = await getAxiosWithToken();
      const response = await axiosInstance.delete(`/order/${id}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Deleting order failed");
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "/order/updateOrderStatus",
  async ({ id, orderStatus }, { rejectWithValue }) => {
    try {
      const axiosInstance = await getAxiosWithToken();
      const response = await axiosInstance.put(`/order/${id}`, { orderStatus });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Updating status failed");
    }
  }
);

export const deleteOrderForAdmin = createAsyncThunk(
  "/order/deleteOrderForAdmin",
  async (id, { rejectWithValue }) => {
    try {
      const axiosInstance = await getAxiosWithToken();
      const response = await axiosInstance.put(`/order/admin-delete/${id}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Soft delete failed");
    }
  }
);

const adminOrderSlice = createSlice({
  name: "adminOrderSlice",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllOrdersForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data;
      })
      .addCase(getAllOrdersForAdmin.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      })
      .addCase(getOrderDetailsForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetailsForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data;
      })
      .addCase(getOrderDetailsForAdmin.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      })
      .addCase(deleteOrderForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteOrderForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedOrder = action.payload.order;
        const index = state.orderList.findIndex((o) => o._id === updatedOrder?._id);
        if (index !== -1) {
          state.orderList[index] = updatedOrder;
        }
      })
      .addCase(deleteOrderForAdmin.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(updateOrderStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedOrder = action.payload.data;
        const index = state.orderList.findIndex((o) => o._id === updatedOrder?._id);
        if (index !== -1) {
          state.orderList[index] = updatedOrder;
        }
      })
      .addCase(updateOrderStatus.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = state.orderList.filter(order => order?._id !== action.payload.order?._id);
      })
      .addCase(deleteOrder.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { resetOrderDetails } = adminOrderSlice.actions;

export default adminOrderSlice.reducer;
