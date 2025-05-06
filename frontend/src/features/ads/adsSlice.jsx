import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import adsService from "./adsService"
import axios from "axios"

const initialState = {
    ads: [],
    ad: {},
    myAds: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
    form: {
        location: '',
        phone: '',
        price:'',
        description:'',
        title:'',
        model:'',
        brand:'',
        subCat:'',
        details:{}
    },
    step: 1,
}

export const getAllads = createAsyncThunk('ads/getAll', async (_, thunkApi) => {
    try {
        return await adsService.getAllads()
    } catch (error) {
        const message = (error.message && error.response.data && error.response.data.message)
            || error.message || error.toString()
        return thunkApi.rejectWithValue(message)
    }
})

export const getAdByUser = createAsyncThunk('ads/getAdsByUser', async (_, thunkApi) => {
    try {
        const token = thunkApi.getState().auth.user.jwtToken;
        return await adsService.getAdByUser(token)
    } catch (error) {
        const message = (error.message && error.response.data && error.response.data.message)
            || error.message || error.toString()
        return thunkApi.rejectWithValue(message)
    }
})


export const getAdById = createAsyncThunk('ads/getOne', async (id, thunkApi) => {
    try {
        return await adsService.getAdById(id)
    } catch (error) {
        const message = (error.message && error.response.data && error.response.data.message)
            || error.message || error.toString()
        return thunkApi.rejectWithValue(message)
    }
})

export const createAd = createAsyncThunk('ads/create', async (adsData, thunkApi) => {
    try {
        const token = thunkApi.getState().auth.user.jwtToken;
        return await adsService.createAd(adsData, token)

    } catch (error) {
        const message = (error.message && error.response.data && error.response.data.message)
            || error.message || error.toString()
        return thunkApi.rejectWithValue(message)
    }
})




export const uploadPhotos = createAsyncThunk('ads/photo', async ({ id, photos }, thunkApi) => {
    try {
        const token = thunkApi.getState().auth.user.jwtToken;
        return await adsService.uploadPhotos(id, photos, token)
    } catch (error) {
        const message = (error.message && error.response.data && error.response.data.message)
            || error.message || error.toString()
        return thunkApi.rejectWithValue(message)
    }
})

export const getAdsbyUser = createAsyncThunk('ads/getallads-belongt-to-user', async (id, thunkApi) => {
    try {
        return await adsService.getAdsbyUser(id)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.error)
            || error.message || error.toString()
        return thunkApi.rejectWithValue(message)
    }
})



export const adsSlice = createSlice({
    name: 'ads',
    initialState,
    reducers: {
        reset: () => initialState,
        setStep: (state, action) => {
            state.step = action.payload;
        },
        setFormData: (state, action) => {
            state.form = { ...state.form, ...action.payload };
        },
    },
    extraReducers: (builder) => {
        builder
            // get All
            .addCase(getAllads.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getAllads.fulfilled, (state, action) => {
                state.isLoading = false
                state.ads = action.payload
                
                state.isError = false
                state.isSuccess = true
            })
            .addCase(getAllads.rejected, (state, action) => {
                state.isLoading = false
                state.message = action.payload
                state.isError = true
                state.isSuccess = false
            })
            // Get Ads By User
            .addCase(getAdByUser.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getAdByUser.fulfilled, (state, action) => {
                state.isLoading = false
                state.myAds = action.payload
                state.isError = false
                state.isSuccess = true
            })
            .addCase(getAdByUser.rejected, (state, action) => {
                state.isLoading = false
                state.message = action.payload
                state.isError = true
                state.isSuccess = false
            })
            // get one 
            .addCase(getAdById.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getAdById.fulfilled, (state, action) => {
                state.isLoading = false
                state.ad = action.payload
                state.isError = false
                state.isSuccess = true
            })
            .addCase(getAdById.rejected, (state, action) => {
                state.isLoading = false
                state.message = action.payload
                state.isError = true
                state.isSuccess = false
            })
            // create ad
            .addCase(createAd.pending, (state) => {
                state.isLoading = true
            })
            .addCase(createAd.fulfilled, (state, action) => {
                state.isLoading = false;
                state.ad = action.payload.ad
                state.ads.push(action.payload.ad);
                
                state.isError = false;
            })
            .addCase(createAd.rejected, (state, action) => {
                state.isLoading = false
                state.message = action.payload
                state.isError = true
            })
    }
})

export const { reset, setFormData, setStep } = adsSlice.actions

export default adsSlice.reducer