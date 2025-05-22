import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import adminService from "./adminService";
import { toast } from "react-toastify";

const initialState = {
  ads: [],
  loading: false,
  error: null,
};

export const getAdsPerDay = createAsyncThunk(
  "ads/getAdsPerDay",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.jwtToken;
      return await adminService.getAdsPerDay(token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const adsSlice = createSlice({
  name: "ads",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAdsPerDay.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdsPerDay.fulfilled, (state, action) => {
        state.loading = false;
        state.ads = action.payload;
      })
      .addCase(getAdsPerDay.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default adsSlice.reducer;
