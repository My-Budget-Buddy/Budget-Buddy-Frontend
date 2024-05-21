import { createSlice } from "@reduxjs/toolkit";

// default date values
const currentDate = new Date();
const months = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];
const selectedMonth = currentDate.getMonth();
const selectedMonthString = months[currentDate.getMonth()];
const selectedYear = currentDate.getFullYear();

export const budgetSlice = createSlice({
    name: "budgets",
    initialState: {
        budgets: [],
        totalFundsAvailable: 0,
        spendingBudget: 0,
        totalReserved: 0,
        totalActuallySpent: 0,
        months: months,
        selectedMonth: selectedMonth,
        selectedMonthString: selectedMonthString,
        selectedYear: selectedYear
    },
    reducers: {
        updateSpendingBudget(state, action) {
            const spendingBudget = action.payload;
            state.spendingBudget = spendingBudget;
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
        },

        // pass in the selectedDate date object
        updateSelectedDate(state, action) {
            const selectedDate = action.payload;
            const selectedMonth = selectedDate.selectedMonth;
            const selectedMonthString = months[selectedMonth];
            const selectedYear = selectedDate.selectedYear;

            state.selectedMonth = selectedMonth;
            state.selectedMonthString = selectedMonthString;
            state.selectedYear = selectedYear;
        }
    }
});

export const {
    updateSpendingBudget,
    updateBudgets,
    updateTotalReserved,
    updateTotalActuallySpent,
    updateSelectedDate
} = budgetSlice.actions;

export default budgetSlice.reducer;