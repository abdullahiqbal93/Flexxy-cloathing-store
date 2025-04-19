import { getAxiosWithToken } from "@/lib/axios/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


export const initialState = {
  userList: [],
  isLoading: true,
};

export const fetchAllUsers = createAsyncThunk(
  "/user/fetchAllUsers",
  async () => {
    const axiosInstance = await getAxiosWithToken();
    const result = await axiosInstance.get(`/user`);
    return result?.data;
  }
);

export const registerUser = createAsyncThunk(
  "/user/adminRegister",
  async (formData, { rejectWithValue }) => {
    try {
      const axiosInstance = await getAxiosWithToken();
      const response = await axiosInstance.post(`/user`, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong" });
    }
  }
);

export const fetchUserById = createAsyncThunk(
  "/user/fetchUserById",
  async (id) => {
    const axiosInstance = await getAxiosWithToken();
    const result = await axiosInstance.get(`/user/${id}`);
    return result?.data;
  }
);

export const editUser = createAsyncThunk(
  "/user/editUser",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const axiosInstance = await getAxiosWithToken();
      const result = await axiosInstance.put(`/user/${id}`, formData);
      return result?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Update failed" });
    }
  }
);

export const deleteUser = createAsyncThunk(
  "/user/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      const axiosInstance = await getAxiosWithToken();
      const result = await axiosInstance.delete(`/user/${id}`);
      return result?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Delete failed" });
    }
  }
);

export const changeUserPassword = createAsyncThunk(
  "user/changePassword",
  async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      const axiosInstance = await getAxiosWithToken();
      const response = await axiosInstance.put(`/user/change-password`, {
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to change password" }
      );
    }
  }
);

export const adminUserSlice = createSlice({
  name: "adminUserSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userList = action.payload.data;
      })
      .addCase(fetchAllUsers.rejected, (state) => {
        state.isLoading = false;
        state.userList = [];
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(changeUserPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(changeUserPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(changeUserPassword.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default adminUserSlice.reducer;
