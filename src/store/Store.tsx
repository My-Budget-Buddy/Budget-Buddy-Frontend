import { configureStore } from "@reduxjs/toolkit";
import w2Reducer from "../pages/Tax/W2Slice";

const store = configureStore({
    reducer: {
        w2 : w2Reducer
    },
});

//The easiest way of getting the State type is to define the root reducer in advance and extract its ReturnType. It is recommended to give the type a different name like RootState to prevent confusion, as the type name State is usually overused.
export type RootState = ReturnType<typeof store.getState>;
//If you want to get the Dispatch type from your store, you can extract it after creating the store. It is recommended to give the type a different name like AppDispatch to prevent confusion, as the type name Dispatch is usually overused.
export type AppDispatch = typeof store.dispatch;

export default store;