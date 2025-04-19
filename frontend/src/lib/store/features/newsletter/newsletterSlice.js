import { getAxiosWithToken } from '@/lib/axios/axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'sonner';

const initialState = {
  subscribers: [],
  isLoading: false,
  sending: false,
  error: null
};

export const fetchSubscribers = createAsyncThunk(
  'newsletter/fetchSubscribers',
  async (_, { rejectWithValue }) => {
    try {
      const axiosInstance = await getAxiosWithToken();
      const response = await axiosInstance.get('/newsletter/subscribers');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch subscribers');
    }
  }
);

export const subscribeEmail = createAsyncThunk(
  'newsletter/subscribe',
  async ({ email }, { rejectWithValue }) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/newsletter/subscribe`, { email });
      toast.success('Successfully subscribed to newsletter!');
      return email;
    } catch (error) {
      return rejectWithValue(error.response?.data?.data?.message || 'Failed to subscribe');
    }
  }
);

export const unsubscribeNewsletter = createAsyncThunk(
  'newsletter/unsubscribe',
  async (email, { rejectWithValue, dispatch }) => {
    try {
      const axiosInstance = await getAxiosWithToken();
      await axiosInstance.post('/newsletter/unsubscribe', { email });
      toast.success('Successfully unsubscribed');
      dispatch(fetchSubscribers());
      return email;
    } catch (error) {
      return rejectWithValue(error.response?.data?.data?.message || 'Failed to unsubscribe');
    }
  }
);

export const sendNewsletter = createAsyncThunk(
  'newsletter/send',
  async ({ subject, content }, { rejectWithValue }) => {
    try {
      const axiosInstance = await getAxiosWithToken();
      const response = await axiosInstance.post('/newsletter/send', { subject, content });
      toast.success('Newsletter sent successfully!');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send newsletter');
    }
  }
);

const newsletterSlice = createSlice({
  name: 'newsletter',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscribers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSubscribers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subscribers = action.payload;
      })
      .addCase(fetchSubscribers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(sendNewsletter.pending, (state) => {
        state.sending = true;
        state.error = null;
      })
      .addCase(sendNewsletter.fulfilled, (state) => {
        state.sending = false;
      })
      .addCase(sendNewsletter.rejected, (state, action) => {
        state.sending = false;
        state.error = action.payload;
      })
      .addCase(subscribeEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(subscribeEmail.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(subscribeEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(unsubscribeNewsletter.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(unsubscribeNewsletter.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(unsubscribeNewsletter.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError } = newsletterSlice.actions;
export default newsletterSlice.reducer;
