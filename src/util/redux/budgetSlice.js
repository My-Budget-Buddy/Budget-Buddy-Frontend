import { createSlice } from "@reduxjs/toolkit"

export const budgetSlice = createSlice({
  name: "budgets",
  initialState: {
    budgets: [],
    totalFundsAvailable: 0, 
    spendingBudget: 0, 
    totalReserved: 0,
    totalActuallySpent: 0
  },
  reducers: {

    updateSpendingBudget(state, action) {
      const spendingBudget = action.payload;
      state.spendingBudget = action.payload;
    },

    updateBudgets(state, action) {
      const budgets = action.payload;
      state.budgets = budgets;
    },
  
    // pass in the amount to be reserved (or a negative amount for unreserving)
    updateTotalReserved(state, action) {
      const reservedAmount = action.payload;
      state.totalReserved += reservedAmount; 
    },

    updateTotalActuallySpent(state, action) {
      const totalSpent = action.payload;
      state.totalActuallySpent += totalSpent;
    }
  }
})

export const { updateSpendingBudget, updateBudgets, updateTotalReserved, updateTotalActuallySpent } = budgetSlice.actions

export default budgetSlice.reducer