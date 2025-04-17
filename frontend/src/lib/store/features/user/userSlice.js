import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios";

export const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

export const registerUser = createAsyncThunk(
  "/auth/register",

  async (formData) => {
    try {
      const response = await axiosInstance.post('/api/v1/user', formData);

      return response.data;
    } catch (error) {
      return error.response?.data || { message: "Something went wrong" };
    }

  }
);

export const fetchUserById = createAsyncThunk(
  "/user/fetchUserById",
  async (id) => {
    const result = await axiosInstance.get(`/api/v1/user/${id}`);
    return result?.data;
  }
);



export const loginUser = createAsyncThunk(
  "/auth/login",

  async (formData) => {
    try {
      const response = await axiosInstance.post('/api/v1/login', formData);

      return response.data;
    } catch (error) {
      return error.response?.data || { message: "Something went wrong" };
    }
  }
);

export const editUser = createAsyncThunk(
  "/user/editUser",
  async ({ id, formData }) => {
    const result = await axiosInstance.put(`/api/v1/user/${id}`, formData);

    return result?.data;
  }
);



export const checkAuth = createAsyncThunk(
  "/auth/checkAuth",

  async () => {
    const response = await axiosInstance.get('/api/v1/check-auth', {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      }
    });

    return response.data;
  }
);

export const logoutUser = createAsyncThunk(
  "/auth/logout",

  async () => {
    const response = await axiosInstance.post('/api/v1/logout', {});

    return response.data;
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
      document.cookie = 'authToken=; Max-Age=0; path=/; secure; SameSite=Strict';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.data : null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.data : null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(editUser.rejected, (state, action) => {
        state.isLoading = false;
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
  }
});

export const { setUser, invalidateUser } = userSlice.actions;

export default userSlice.reducer;
