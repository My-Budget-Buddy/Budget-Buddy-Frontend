import { createSlice } from '@reduxjs/toolkit'

export const budgetSlice = createSlice({
  name: 'update',
  initialState: {
    value: 0
  },
  reducers: {

    update: state => {
        state.value += 1; 
    }
  }
})

export const { update } = budgetSlice.actions

export default budgetSlice.reducer