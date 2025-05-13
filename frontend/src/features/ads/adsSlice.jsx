import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import adsService from "./adsService";
import axios from "axios";
import { toast } from 'react-toastify';

const initialState = {
  ads: [],
  ad: {},
  myAds: [],
  searchedAds: [],
  AdsFilter: [],
  favorites:[],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
  form: {
    location: "",
    phone: "",
    price: "",
    description: "",
    title: "",
    model: "",
    brand: "",
    subCat: "",
    details: {},
  },
  step: 1,
};

export const getAllads = createAsyncThunk("ads/getAll", async (_, thunkApi) => {
  try {
    return await adsService.getAllads();
  } catch (error) {
    const message =
      (error.message && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkApi.rejectWithValue(message);
  }
});

export const getAdByUser = createAsyncThunk(
  "ads/getAdsByUser",
  async (_, thunkApi) => {
    try {
      const token = thunkApi.getState().auth.user.jwtToken;
      return await adsService.getAdByUser(token);
    } catch (error) {
      const message =
        (error.message && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkApi.rejectWithValue(message);
    }
  }
);

export const getAdById = createAsyncThunk(
  "ads/getOne",
  async (id, thunkApi) => {
    try {
      const token = thunkApi.getState().auth.user?.jwtToken;
      return await adsService.getAdById(id, token);
    } catch (error) {
      const message =
        (error.message && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkApi.rejectWithValue(message);
    }
  }
);


export const createAd = createAsyncThunk(
  "ads/create",
  async (adsData, thunkApi) => {
    try {
      const token = thunkApi.getState().auth.user.jwtToken;
      return await adsService.createAd(adsData, token);
    } catch (error) {
      const message =
        (error.message && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkApi.rejectWithValue(message);
    }
  }
);

export const uploadPhotos = createAsyncThunk(
  "ads/photo",
  async ({ id, photos }, thunkApi) => {
    try {
      const token = thunkApi.getState().auth.user.jwtToken;
      return await adsService.uploadPhotos(id, photos, token);
    } catch (error) {
      const message =
        (error.message && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkApi.rejectWithValue(message);
    }
  }
);

export const getAdsbyUser = createAsyncThunk(
  "ads/getallads-belongt-to-user",
  async (id, thunkApi) => {
    try {
      return await adsService.getAdsbyUser(id);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.error) ||
        error.message ||
        error.toString();
      return thunkApi.rejectWithValue(message);
    }
  }
);

export const updateAd = createAsyncThunk(
  "ads/update",
  async ({ _id, adUpdate }, thunkApi) => {
    try {
      const token = thunkApi.getState().auth.user.jwtToken;
      return await adsService.updateAd({ _id, adUpdate }, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkApi.rejectWithValue(message);
    }
  }
);

export const deleteAd = createAsyncThunk("ads/delete", async (id, thunkApi) => {
  try {
    const token = thunkApi.getState().auth.user.jwtToken;
    return await adsService.deleteAd(id, token);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkApi.rejectWithValue(message);
  }
});

export const getPopulareAds = createAsyncThunk("ads/getPopular", async (_, thunkApi) => {
    try {
      return await adsService.getPopulareAds();
    } catch (error) {
      const message =
        (error.message && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkApi.rejectWithValue(message);
    }
  });

  export const fetchSearchedAds = createAsyncThunk(
    'ads/search',
    async (filters, thunkAPI) => {
      try {
        return await adsService.searchAds(filters);
      } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Search failed');
      }
    }
  );

  export const filterAds = createAsyncThunk(
    'ads/filter',
    async (filter , thunkAPI) => {
      try {
        return await adsService.filterAds(filter);
      } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Filter failed')
      }
    }
  )

  export const getFavorites = createAsyncThunk('favorites/getAll', async (_, thunkApi) => {
  try {
    const token = thunkApi.getState().auth.user.jwtToken;
    return await adsService.getFavorites(token);
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data?.message || 'Error loading favorites');
  }
});

export const addFavorite = createAsyncThunk('favorites/add', async (adId, thunkApi) => {
  try {
     const token = thunkApi.getState().auth.user.jwtToken;
    const response = await adsService.addFavorite(adId,token);
    toast.success(response.message);
    return { adId };
  } catch (error) {
    toast.error(error.response?.data?.message || 'Error adding to favorites');
    return thunkApi.rejectWithValue(error.response?.data?.message);
  }
});

export const removeFavorite = createAsyncThunk('favorites/remove', async (adId, thunkApi) => {
  try {
     const token = thunkApi.getState().auth.user.jwtToken;
    const response = await adsService.removeFavorite(adId,token);
    toast.success(response.message);
    return { adId };
  } catch (error) {
    toast.error(error.response?.data?.message || 'Error removing from favorites');
    return thunkApi.rejectWithValue(error.response?.data?.message);
  }
});



export const adsSlice = createSlice({
  name: "ads",
  initialState,
  reducers: {
    reset: () => initialState,
    setStep: (state, action) => {
      state.step = action.payload;
    },
    setFormData: (state, action) => {
      state.form = { ...state.form, ...action.payload };
    },
    clearSearchedAds: (state) => {
        state.searchedAds = []
    },
    clearFilterAds: (state) => {
      state.filterAds = []
    },
      resetFavorites: (state) => {
      state.items = [];
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // get All
      .addCase(getAllads.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllads.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ads = action.payload;
        state.isError = false;
        state.isSuccess = true;
      })
      .addCase(getAllads.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
        state.isError = true;
        state.isSuccess = false;
      })
      // Get Ads By User
      .addCase(getAdByUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAdByUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myAds = action.payload;
        state.isError = false;
        state.isSuccess = true;
      })
      .addCase(getAdByUser.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
        state.isError = true;
        state.isSuccess = false;
      })
      // get one
      .addCase(getAdById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAdById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ad = action.payload;
        state.isError = false;
        state.isSuccess = true;
      })
      .addCase(getAdById.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
        state.isError = true;
        state.isSuccess = false;
      })
      // create ad
      .addCase(createAd.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createAd.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ad = action.payload.ad;
        state.ads.push(action.payload.ad);

        state.isError = false;
      })
      .addCase(createAd.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
        state.isError = true;
      })
      // update ad
      .addCase(updateAd.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateAd.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "Ad updated successfully";

        const index = state.ads.findIndex(
          (ad) => ad._id === action.payload._id
        );
        if (index !== -1) {
          state.ads[index] = action.payload;
        }
        if (state.ad._id === action.payload._id) {
          state.ad = action.payload;
        }
      })
      .addCase(updateAd.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // uploadPhoto
      .addCase(uploadPhotos.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        if (action.payload && action.payload.images) {
          state.ad.images = action.payload.images;
        } else {
          state.message = "No images returned in response";
        }
        state.isSuccess = true;
        state.message = "Photos uploaded successfully";
        state.step = 1;
        state.form = {
          location: "",
          phone: "",
          price: "",
          description: "",
          title: "",
          model: "",
          brand: "",
          subCat: "",
          details: {},
        };
      })
      .addCase(deleteAd.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteAd.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "Ad deleted successfully";
        state.ads = state.ads.filter((ad) => ad._id !== action.payload._id);
      })
      .addCase(deleteAd.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // get Populare ads 
      .addCase(getPopulareAds.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPopulareAds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ads = action.payload;
        state.isError = false;
        state.isSuccess = true;
      })
      .addCase(getPopulareAds.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
        state.isError = true;
        state.isSuccess = false;
      })
      // search 
      .addCase(fetchSearchedAds.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSearchedAds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchedAds = action.payload;
      })
      .addCase(fetchSearchedAds.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // filter
     .addCase(filterAds.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(filterAds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.AdsFilter = action.payload;
        state.isError = false;
        state.isSuccess = true;
      })
      .addCase(filterAds.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.isSuccess = false;
      })
      // favorites 
      .addCase(getFavorites.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.favorites = action.payload;
      })
      .addCase(getFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        // Optional: handle frontend update if needed
      })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.items = state.items.filter(fav => fav.ad._id !== action.payload.adId);
      });
  },
});

export const { reset, setFormData, setStep , clearSearchedAds , clearFilterAds , resetFavorites } = adsSlice.actions;

export default adsSlice.reducer;
