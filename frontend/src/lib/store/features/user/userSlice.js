import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

export const registerUser = createAsyncThunk(
  "/auth/register",

  async (formData) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/user`,
        formData,
        {
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      return error.response?.data || { message: "Something went wrong" };
    }

  }
);

export const fetchUserById = createAsyncThunk(
  "/user/fetchUserById",
  async (id) => {
    const result = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/user/${id}`, {
      withCredentials: true,
    });
    return result?.data;
  }
);



export const loginUser = createAsyncThunk(
  "/auth/login",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/login`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong" });
    }
  }
);

export const editUser = createAsyncThunk(
  "/user/editUser",
  async ({ id, formData }) => {
    const result = await axios.put(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/user/${id}`,
      formData,
      {
        withCredentials: true,
      }
    );

    return result?.data;
  }
);



export const checkAuth = createAsyncThunk(
  "/auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('authToken='));
      if (!token) {
        return rejectWithValue({ success: false, message: 'No auth token found' });
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/check-auth`,
        {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${token.split('=')[1]}`,
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          }
        }
      );

      return response.data;
    } catch (error) {
      document.cookie = 'authToken=; Max-Age=0; path=/; secure; SameSite=Strict';
      return rejectWithValue({ 
        success: false, 
        message: error.response?.data?.message || 'Authentication failed'
      });
    }
  }
);

export const logoutUser = createAsyncThunk(
  "/auth/logout",

  async () => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/logout`, {},
      {
        withCredentials: true,
      }
    );
    // Remove authToken cookie on client side
    document.cookie = 'authToken=; Max-Age=0; path=/; secure; SameSite=Strict';
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
