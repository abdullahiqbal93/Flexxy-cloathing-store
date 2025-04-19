import { getAxiosWithToken } from "@/lib/axios/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  error: null,
  productList: [],
  productDetails: null,
  brands: [],
  reviewsByProduct: {},
  averageRatings: {},
};



export const addNewProduct = createAsyncThunk(
  "/product/addnewproduct",
  async (formData, { rejectWithValue }) => {
    try {
      const axiosInstance = await getAxiosWithToken();
      const result = await axiosInstance.post(`/product`, formData);
      return result?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add product");
    }
  }
);

export const editProduct = createAsyncThunk(
  "/product/editProduct",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const axiosInstance = await getAxiosWithToken();
      const result = await axiosInstance.put(`/product/${id}`, formData);
      return result?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to edit product");
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "/product/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      const axiosInstance = await getAxiosWithToken();
      const result = await axiosInstance.delete(`/product/${id}`);
      return result?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete product");
    }
  }
);

export const addReview = createAsyncThunk(
  "/product/addReview",
  async ({ productId, formdata }, { rejectWithValue }) => {
    try {
      const axiosInstance = await getAxiosWithToken();
      const result = await axiosInstance.post(`/product/${productId}/review`, formdata);
      return result.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to add review" });
    }
  }
);

export const updateReview = createAsyncThunk(
  "/product/updateReview",
  async ({ productId, reviewId, formdata }, { rejectWithValue }) => {
    try {
      const axiosInstance = await getAxiosWithToken();
      const result = await axiosInstance.put(`/product/${productId}/review/${reviewId}`, formdata);
      return result.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to update review" });
    }
  }
);

export const deleteReview = createAsyncThunk(
  "/product/deleteReview",
  async ({ productId, reviewId, userId }, { rejectWithValue }) => {
    try {
      const axiosInstance = await getAxiosWithToken();
      const result = await axiosInstance.delete(`/product/${productId}/review/${reviewId}`, {
        data: { userId },
      });
      return { ...result.data, productId, reviewId };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to delete review" });
    }
  }
);



export const fetchAllProducts = createAsyncThunk(
  "/product/fetchAllProducts",
  async (_, { rejectWithValue }) => {
    try {
      const axiosInstance = await getAxiosWithToken();
      const result = await axiosInstance.get(`/product`);
      return result?.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch products");
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "/product/fetchProductById",
  async (productId, { rejectWithValue }) => {
    try {
      const axiosInstance = await getAxiosWithToken();
      const result = await axiosInstance.get(`/product/${productId}`);
      return result?.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch product details");
    }
  }
);

export const fetchAllFilteredProducts = createAsyncThunk(
  "/product/fetchAllFilteredProducts",
  async ({ filterParams, sortParams }, { rejectWithValue }) => {
    try {
      const axiosInstance = await getAxiosWithToken();
      const query = new URLSearchParams({
        ...filterParams,
        sortBy: sortParams,
      });
      const result = await axiosInstance.get(`/filtered-products?${query}`);
      return result?.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch filtered products");
    }
  }
);

export const fetchProductDetails = createAsyncThunk(
  "/product/fetchProductDetails",
  async (id, { rejectWithValue }) => {
    try {
      const axiosInstance = await getAxiosWithToken();
      const result = await axiosInstance.get(`/product/${id}`);
      return result?.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch product details");
    }
  }
);

export const fetchAllBrands = createAsyncThunk(
  "/product/fetchBrands",
  async (_, { rejectWithValue }) => {
    try {
      const axiosInstance = await getAxiosWithToken();
      const result = await axiosInstance.get(`/product/brand`);
      return result?.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch brands");
    }
  }
);



const updateAverageRating = (state, productId) => {
  const product = state.productDetails;
  if (!product || !product.reviews) return;

  const totalRating = product.reviews.reduce((sum, review) => sum + review.reviewValue, 0);
  product.averageRating = product.reviews.length ? totalRating / product.reviews.length : 0;
};

const productSlice = createSlice({
  name: "productSlice",
  initialState,
  reducers: {
    resetProductDetails: (state) => {
      state.productDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFilteredProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data;
      })
      .addCase(fetchAllFilteredProducts.rejected, (state) => {
        state.isLoading = false;
        state.productList = [];
      })
      .addCase(fetchProductById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetails = action.payload.data;
        updateAverageRating(state, action.payload.data._id);
      })
      .addCase(fetchProductById.rejected, (state) => {
        state.isLoading = false;
        state.productDetails = null;
      })
      .addCase(fetchAllProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data;
      })
      .addCase(fetchAllProducts.rejected, (state) => {
        state.isLoading = false;
        state.productList = [];
      })
      .addCase(addReview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.productDetails = action.payload.data;
          updateAverageRating(state, action.payload.data._id);
        }
      })
      .addCase(addReview.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(updateReview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.productDetails = action.payload.data;
          updateAverageRating(state, action.payload.data._id);
        }
      })
      .addCase(updateReview.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteReview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success && state.productDetails) {
          state.productDetails.reviews = state.productDetails.reviews.filter(
            (review) => review._id !== action.payload.reviewId
          );
          updateAverageRating(state, action.payload.productId);
        }
      })
      .addCase(deleteReview.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { resetProductDetails } = productSlice.actions;
export default productSlice.reducer;
