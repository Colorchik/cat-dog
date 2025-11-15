import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const loadCats = createAsyncThunk("load/cats", async () => {
    return fetch("https://api.thecatapi.com/v1/images/search?size=full")
    .then(responce => responce.json())
})
const CatsSlice = createSlice({
    name: 'cats',
    initialState: [{
        // url: "",
        load: "idle",
        error: "none"
    }],
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(loadCats.pending, (state) => {
            return {
                ...state,
                load: " loading"
            }
        })
        .addCase(loadCats.rejected, (state, action) => {
            return {
                ...state,
                load: 'error',
                error: action.error.message as string
            }
        })
        .addCase(loadCats.fulfilled, (state, action) => {
            return {
                ...state,
                dogs: action.payload,
                load: "success",
                error: "none"
            }
        })
    }
})

export default CatsSlice.reducer