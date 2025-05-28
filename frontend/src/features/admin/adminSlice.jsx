import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { toast } from "react-toastify";
import adminService from "./adminsService";


const initialState = {
  ads: [],
  stats: {},
  adsBySubCategory: [],
  users: [],
  reports: [],
  loading: false,
  error: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
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
      return await  adminService.getDashboardStats(token);
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
      console.error("Role update error:", error.response?.data || error.message); // Debug log
      const message =
        error.response?.data?.message || error.message || "Server Error";
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




export const createReport = createAsyncThunk(
  'report/create',
  async (reportData, thunkAPI) => {
    try {
     const token = thunkAPI.getState().auth.user.jwtToken;
      return await adminService.createReport(reportData, token);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error');
return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error');

     
    }
  }
);

export const getAllReports = createAsyncThunk(
  'report/getAll',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.jwtToken;
      return await adminService.getAllReports(token);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error');
return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error');

    }
  }
);

export const acceptReport = createAsyncThunk(
  "admin/acceptReport",
  async (reportId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.jwtToken;
      return await adminService.acceptReport(reportId, token);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Server Error";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteReport = createAsyncThunk(
  "admin/deleteReport",
  async (reportId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.jwtToken;
      return await adminService.deleteReport(reportId, token);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Server Error";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);


const adsSlice = createSlice({
  name: "ads",
  initialState,
  reducers: {
      resetReportState: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    }
  },
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
        state.users = state.users.filter((user) => user._id !== action.payload);
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
        const updatedUser = action.payload;
        const index = state.users.findIndex(
          (user) => user._id === updatedUser._id
        );
        if (index !== -1) {
          state.users[index] = updatedUser;
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
        state.ads = state.ads.filter((ad) => ad._id !== action.payload);
      })
      .addCase(deleteAd.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //reports 
      .addCase(createReport.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createReport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = 'Report created successfully';
      })
      .addCase(createReport.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || 'Error creating report';
      })

      .addCase(getAllReports.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllReports.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.reports = action.payload;
      })
      .addCase(getAllReports.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || 'Error fetching reports';
      })

        // accept
      .addCase(acceptReport.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(acceptReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // delete
      .addCase(deleteReport.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetReportState } = adsSlice.actions;
export default adsSlice.reducer;
