import { getAxiosWithToken } from "@/lib/axios/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  token: null,
};

export const registerUser = createAsyncThunk(
  "/auth/register",
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
  async (id, { rejectWithValue }) => {
    try {
      const axiosInstance = await getAxiosWithToken();
      const result = await axiosInstance.get(`/user/${id}`);
      return result?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to fetch user" });
    }
  }
);

export const loginUser = createAsyncThunk(
  "/auth/login",
  async (formData, { rejectWithValue }) => {
    try {
      const axiosInstance = await getAxiosWithToken();
      const response = await axiosInstance.post(`/login`, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong" });
    }
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
      return rejectWithValue(error.response?.data || { message: "Failed to update user" });
    }
  }
);

export const checkAuth = createAsyncThunk(
  "/auth/checkAuth",
  async (token, { rejectWithValue }) => {
    try {
      const axiosInstance = await getAxiosWithToken();
      const response = await axiosInstance.get(`/check-auth`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue({
        success: false,
        message: error.response?.data?.message || "Authentication failed",
      });
    }
  }
);

export const logoutUser = createAsyncThunk(
  "/auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const axiosInstance = await getAxiosWithToken();
      const response = await axiosInstance.post(`/logout`, {});
      sessionStorage.removeItem("authToken");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Logout failed" });
    }
  }
);

export const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    invalidateUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      sessionStorage.removeItem("authToken");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
        state.token = action.payload.token;
        sessionStorage.setItem("authToken", action.payload.token);
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.token = null;
      })
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.data : null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(editUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = {
          ...state.user,
          name: action.payload.data.name,
          phoneNumber: action.payload.data.phoneNumber,
        };
        state.isAuthenticated = action.payload.success;
      })
      .addCase(editUser.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { setUser, invalidateUser } = userSlice.actions;

export default userSlice.reducer;
