import { getAxiosWithToken } from "@/lib/axios/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const initialState = {
  userList: [],
  isLoading: true,
};

export const fetchAllUsers = createAsyncThunk(
  "/user/fetchAllUsers",
  async () => {
    const result = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/user`, {
      withCredentials: true,
    });

    return result?.data;
  }
);

export const registerUser = createAsyncThunk(
  "/user/adminRegister",

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

// export const fetchUserById = createAsyncThunk(
//   "/user/fetchUserById",
//   async (id) => {
//     const result = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/user/${id}`, {
//       withCredentials: true,
//     });
//     return result?.data;
//   }
// );

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
  async ({ id, formData }) => {
    const axiosInstance = await getAxiosWithToken();
    const result = await axiosInstance.put(`/user/${id}`, formData);

    return result?.data;
  }
);

export const deleteUser = createAsyncThunk("/user/deleteUser", async (id) => {
  const axiosInstance = await getAxiosWithToken();
  const result = await axiosInstance.delete(`/user/${id}`);

  return result?.data;
});

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
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.userList = [];
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(changeUserPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(changeUserPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(changeUserPassword.rejected, (state, action) => {
        state.isLoading = false;
      });
  },
});

export default adminUserSlice.reducer;
