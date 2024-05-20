import { configureStore } from '@reduxjs/toolkit'
import budgetReducer from './budgetSlice'
import formSubmissionReducer from './formSubmissionStateSlice'
import w2Reducer from "../../pages/Tax/W2Slice";

export const store = configureStore({
  reducer: {
    budgets: budgetReducer,
    formStatus: formSubmissionReducer,
    w2 : w2Reducer
  }
})

export default store;

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store