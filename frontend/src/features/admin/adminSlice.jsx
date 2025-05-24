import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import adminService from "./adminService";
import { toast } from "react-toastify";

const initialState = {
  ads: [],
  stats: {},
  adsBySubCategory: [],
  users: [],
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

export const getDashboardStats = createAsyncThunk(
  "admin/getDashboardStats",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.jwtToken;
      return await adminService.getDashboardStats(token);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getAdsBySubCategory = createAsyncThunk(
  "ads/getAdsBySubCategory",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.jwtToken;
      return await adminService.getAdsBySubCategory(token);
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

export const getAllUsers = createAsyncThunk(
  "admin/getAllUsers",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.jwtToken;
      return await adminService.getAllUsers(token);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.jwtToken;
      await adminService.deleteUser(id, token);
      return id;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateUserRole = createAsyncThunk(
  "admin/updateUserRole",
  async ({ _id, role }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.jwtToken;
      const data = await adminService.updateUserRole(_id, role, token);
      return data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getAllAds = createAsyncThunk(
  "admin/getAllAds",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.jwtToken;
      return await adminService.getAllAds(token);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteAd = createAsyncThunk(
  "admin/deleteAd",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.jwtToken;
      await adminService.deleteAd(id, token);
      return id;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
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
      // getAdsPerDay
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
      })

      // getDashboardStats
      .addCase(getDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(getDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // getAdsBySubCategory
      .addCase(getAdsBySubCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdsBySubCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.adsBySubCategory = action.payload;
      })
      .addCase(getAdsBySubCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // getAllUsers
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // deleteUser
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(user => user._id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // updateUserRole
      .addCase(updateUserRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex(user => user._id === action.payload._id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // getAllAds
      .addCase(getAllAds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllAds.fulfilled, (state, action) => {
        state.loading = false;
        state.ads = action.payload;
      })
      .addCase(getAllAds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // deleteAd
      .addCase(deleteAd.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAd.fulfilled, (state, action) => {
        state.loading = false;
        state.ads = state.ads.filter(ad => ad._id !== action.payload);
      })
      .addCase(deleteAd.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default adsSlice.reducer;
