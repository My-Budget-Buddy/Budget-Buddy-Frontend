import { configureStore } from "@reduxjs/toolkit";
import bucketReducer from "./bucketSlice";
import budgetReducer from "./budgetSlice";
import formSubmissionReducer from "./formSubmissionStateSlice";
import simpleSubmissionReducer from "./simpleSubmissionSlice";
import w2Reducer from "../../pages/Tax/W2Slice";
import taxReturnReducer from "../../pages/Tax/TaxReturnSlice"
import otherIncomeReducer from "../../pages/Tax/otherIncomeSlice"
import deductionsReducer from "../../pages/Tax/deductionsSlice"

export const store = configureStore({
    reducer: {
        buckets: bucketReducer,
        budgets: budgetReducer,
        formStatus: formSubmissionReducer,
        simpleFormStatus: simpleSubmissionReducer,
        w2: w2Reducer,
        taxReturn: taxReturnReducer,
        otherIncome : otherIncomeReducer,
        deductions : deductionsReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
