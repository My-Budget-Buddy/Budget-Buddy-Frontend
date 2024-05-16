import { configureStore } from '@reduxjs/toolkit'
import budgetReducer from './counterSlice'

export default configureStore({
  reducer: {
    formStatus: budgetReducer
  }
})