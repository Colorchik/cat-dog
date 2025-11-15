import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import catSliceReducer from "./cat.slice";
import dogSliceReduser from "./dog.slice";


const store = configureStore({
    reducer: {
        dogs: dogSliceReduser,
        cats: catSliceReducer,
    }
});

type RootState = ReturnType<typeof store.getState>
type AppDispatch = typeof store.dispatch

export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()

export default store