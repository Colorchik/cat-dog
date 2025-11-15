import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const loadDogs = createAsyncThunk("load/dogs", async () => {
    return fetch("https://random.dog/woof.json")
    .then(responce => responce.json())
})
const dogSlice = createSlice({
    name: 'dogs',
    initialState: {
        // message: "",
        load: "idle",
        error: "none"
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(loadDogs.pending, (state) => {
            return {
                ...state,
                load: " loading"
            }
        })
        .addCase(loadDogs.rejected, (state, action) => {
            return {
                ...state,
                load: 'error',
                error: action.error.message as string
            }
        })
        .addCase(loadDogs.fulfilled, (state, action) => {
            return {
                ...state,
                dogs: action.payload,
                load: "success",
                error: "none"
            }
        })
    }
})

export default dogSlice.reducer
