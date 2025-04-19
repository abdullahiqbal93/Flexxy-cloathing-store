import { getAxiosWithToken } from "@/lib/axios/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  approvalURL: null,
  isLoading: false,
  orderId: null,
  orderList: [],
  orderDetails: null,
};

export const createNewOrder = createAsyncThunk(
  "/order/createNewOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const axiosInstance = await getAxiosWithToken();
      const response = await axiosInstance.post(`/add-order`, orderData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Order creation failed");
    }
  }
);

export const capturePayment = createAsyncThunk(
  "/order/capturePayment",
  async ({ paymentId, payerId, orderId }, { rejectWithValue }) => {
    try {
      const axiosInstance = await getAxiosWithToken();
      const response = await axiosInstance.post(`/order/capture`, {
        paymentId,
        payerId,
        orderId,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Payment capture failed");
    }
  }
);

export const getAllOrdersByUserId = createAsyncThunk(
  "/order/getAllOrdersByUserId",
  async (userId, { rejectWithValue }) => {
    try {
      const axiosInstance = await getAxiosWithToken();
      const response = await axiosInstance.get(`/order?userId=${userId}`);
      return response.data.data.filter(order => !order.deletedFor?.user);
    } catch (error) {
      return rejectWithValue(error.response?.data || "Fetching orders failed");
    }
  }
);

export const getOrderDetails = createAsyncThunk(
  "/order/getOrderDetails",
  async (id, { rejectWithValue }) => {
    try {
      const axiosInstance = await getAxiosWithToken();
      const response = await axiosInstance.get(`/order/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Fetching order details failed");
    }
  }
);

export const cancelOrder = createAsyncThunk(
  "/order/cancelOrder",
  async (id, { rejectWithValue }) => {
    try {
      const axiosInstance = await getAxiosWithToken();
      const response = await axiosInstance.post(`/order/cancel/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Cancelling order failed");
    }
  }
);

export const deleteOrderForUser = createAsyncThunk(
  "/order/deleteOrderForUser",
  async (id, { rejectWithValue }) => {
    try {
      const axiosInstance = await getAxiosWithToken();
      const response = await axiosInstance.put(`/order/delete/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Deleting order failed");
    }
  }
);

const orderSlice = createSlice({
  name: "orderSlice",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNewOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.approvalURL = action.payload.approvalURL;
        state.orderId = action.payload.orderId;
        sessionStorage.setItem("currentOrderId", JSON.stringify(action.payload.orderId));
      })
      .addCase(createNewOrder.rejected, (state) => {
        state.isLoading = false;
        state.approvalURL = null;
        state.orderId = null;
      })
      .addCase(getAllOrdersByUserId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersByUserId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload || [];
      })
      .addCase(getAllOrdersByUserId.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      })
      .addCase(getOrderDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data;
      })
      .addCase(getOrderDetails.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      })
      .addCase(cancelOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedOrder = action.payload.order;
        const index = state.orderList.findIndex((o) => o._id === updatedOrder?._id);
        if (index !== -1) {
          state.orderList[index] = updatedOrder;
        }
      })
      .addCase(cancelOrder.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteOrderForUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteOrderForUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = state.orderList.filter(order => order?._id !== action.payload.order?._id);
      })
      .addCase(deleteOrderForUser.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { resetOrderDetails } = orderSlice.actions;

export default orderSlice.reducer;
