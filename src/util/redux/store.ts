import { configureStore } from "@reduxjs/toolkit";
import bucketReducer from "./bucketSlice";
import budgetReducer from "./budgetSlice";
import formSubmissionReducer from "./formSubmissionStateSlice";
import simpleSubmissionReducer from "./simpleSubmissionSlice";
import w2Reducer from "../../pages/Tax/W2Slice";

export const store = configureStore({
    reducer: {
        buckets: bucketReducer,
        budgets: budgetReducer,
        formStatus: formSubmissionReducer,
        simpleFormStatus: simpleSubmissionReducer,
        w2: w2Reducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
