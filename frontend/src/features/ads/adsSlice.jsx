import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import adsService from "./adsService"

const initialState = {
    ads: [],
    ad : null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
}

export const getAllads = createAsyncThunk('ads/getAll', async (_, thunkApi) => {
    try {
        return await adsService.getAllads()
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.error)
            || error.message || error.toString()
        return thunkApi.rejectWithValue(message)
    }
})

export const getAdById = createAsyncThunk('ads/getOne', async (id, thunkApi) => {
    try {
        return await adsService.getAdById(id)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.error)
            || error.message || error.toString()
        return thunkApi.rejectWithValue(message)
    }
})

export const createAd = createAsyncThunk(
    'ad/create',
    async (adData , thunkApi) => {
        try {
            const token = thunkApi.getState().auth.user?.jwtToken;
            if (!token) throw new Error("Missing authentication token!");
            return await adsService.createAd(adData, token);
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return thunkApi.rejectWithValue(message);
        }
    }
)

export const adsSlice = createSlice({
    name: 'ads',
    initialState,
    reducers: {
        reset: () => initialState
    },
    extraReducers: (builder) => {
        builder
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
                state.ads.ads.push(action.payload);
                state.isError = false;
            })
            .addCase(createAd.rejected, (state, action) => {
                state.isLoading = false
                state.message = action.payload
                state.isError = true
            })
    }
})

export const { reset } = adsSlice.actions

export default adsSlice.reducer
