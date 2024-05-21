import { createSlice } from "@reduxjs/toolkit"

export const budgetSlice = createSlice({
  name: "update",
  initialState: {
    buckets: [],
    totalReserved: 0,
  },
  reducers: {

    updateBuckets(state, action) {
      const buckets = action.payload;
      state.buckets = buckets;
    },
  
    // pass in the amount to be reserved (or a negative amount for unreserving)
    updateTotalReserved(state, action) {
      const reservedAmount = action.payload;
      state.totalReserved += reservedAmount; 
    }
  }
})

export const { updateBuckets, updateTotalReserved } = budgetSlice.actions

export default budgetSlice.reducer