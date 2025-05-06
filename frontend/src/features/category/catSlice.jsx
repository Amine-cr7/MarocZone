import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import catService from "./catService"


const initialState = {
    categories: [],
    subcategory:[],
    isError: '',
    isSuccess: '',
    isLoading: '',
    message: ''
}

export const getCategories = createAsyncThunk('categories/getCategories', async (_, thunkApi) => {
    try {
       return await catService.getCategories()
        
    } catch (error) {
        const message = (error.message && error.response.data && error.response.data.message)
            || error.message || error.toString()
        return thunkApi.rejectWithValue(message)
    }
})



export const catSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        reset: (state) => initialState,
        setSelectedSubcategory:(state,action) => {
            state.subcategory = action.payload
        }
    },
    extraReducers:(builder) => {
        builder

        .addCase(getCategories.pending,(state) => {
            state.isLoading = true
        })
        .addCase(getCategories.fulfilled,(state,action) => {
            state.isLoading = false
            state.categories = action.payload
            state.isError = false
        })
        .addCase(getCategories.rejected,(state,action) => {
            state.isLoading = false
            state.message = action.payload
            state.isError = true
        })

        

        
    }
})

export const { reset ,setSelectedSubcategory} = catSlice.actions

export default catSlice.reducer