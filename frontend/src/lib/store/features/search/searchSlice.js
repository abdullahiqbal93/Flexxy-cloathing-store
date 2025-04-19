import { getAxiosWithToken } from "@/lib/axios/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


const initialState = {
    isLoading: false,
    searchResults: [],
};

export const getSearchResults = createAsyncThunk(
    "/product/getSearchResults",
    async (keyword, { rejectWithValue }) => {
        try {
            const axiosInstance = await getAxiosWithToken();
            const response = await axiosInstance.get(`/search/${keyword}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Search failed");
        }
    }
);

const searchSlice = createSlice({
    name: "searchSlice",
    initialState,
    reducers: {
        resetSearchResults: (state) => {
            state.searchResults = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getSearchResults.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getSearchResults.fulfilled, (state, action) => {
                state.isLoading = false;
                state.searchResults = action.payload.data;
            })
            .addCase(getSearchResults.rejected, (state) => {
                state.isLoading = false;
                state.searchResults = [];
            });
    },
});

export const { resetSearchResults } = searchSlice.actions;

export default searchSlice.reducer;
