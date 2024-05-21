import { configureStore } from '@reduxjs/toolkit'
import bucketReducer from './bucketSlice'
import budgetReducer from './budgetSlice'
import formSubmissionReducer from './formSubmissionStateSlice'
import simpleSubmissionReducer from './simpleSubmissionSlice'

export const store = configureStore({
  reducer: {
    buckets: bucketReducer,
    budgets: budgetReducer,
    formStatus: formSubmissionReducer,
    simpleFormStatus: simpleSubmissionReducer
  }
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store