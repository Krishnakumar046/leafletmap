import { configureStore } from "@reduxjs/toolkit";
import mapViewSlice from "../store/slices/mapViewSlice"

export const store = configureStore({
    reducer:{
        mapView:mapViewSlice
    }
})
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
