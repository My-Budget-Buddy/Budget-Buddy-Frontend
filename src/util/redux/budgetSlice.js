import { createSlice } from '@reduxjs/toolkit'

export const budgetSlice = createSlice({
  name: 'budgetSummary',
  initialState: {
    totalAvailableFunds: 0,
    totalSpendingBudget: 0,
    totalActuallySpent: 0
  },
  reducers: {
    //update total available funds
    //update spending budget (what you CAN spend)
    //update total actually spent
    
    update: state => {
        state.value += 1; 
    }
  }
})

export const { update } = budgetSlice.actions

export default budgetSlice.reducer