import { createSlice } from "@reduxjs/toolkit";
import { BudgetRowProps } from "../../types/budgetInterfaces";

// default date values
const currentDate = new Date();
const months = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];
const selectedMonth = currentDate.getMonth();
const selectedMonthString = months[currentDate.getMonth()];
const selectedYear = currentDate.getFullYear();

// Create monthYear string from selectedMonth and selectedYear
const month =
    (selectedMonth + 1).toString().length === 2 ? (selectedMonth + 1).toString() : "0" + (selectedMonth + 1).toString();
const year = selectedYear.toString();
const monthYear = year + "-" + month;
console.log("default monthyear", monthYear);

// IMPORTANT NOTE: We use an endpoint to get the budgets for a specific month/year. All the following information reflects ONLY the bdugets information of a given month/year, and NOT any budgets for any other time period.
export const budgetSlice = createSlice({
    name: "budgets",
    initialState: {
        budgets: [], // stores the budgets for the currently selected month
        totalFundsAvailable: 0,
        spendingBudget: 0,
        totalReserved: 0,
        totalActuallySpent: 0,
        months: months,
        selectedMonth: selectedMonth,
        selectedMonthString: selectedMonthString,
        selectedYear: selectedYear,
        monthYear: monthYear
    },
    reducers: {
        updateSpendingBudget(state, action) {
            const spendingBudget = action.payload;
            state.spendingBudget = spendingBudget;
        },

        updateBudgets(state, action) {
            const budgets = action.payload;
            state.budgets = budgets;

            //Each time budgets changes, refresh the total actually spent and reserved state
            const totalSpent = budgets.reduce((total: number, row: BudgetRowProps) => total + row.spentAmount, 0);
            state.totalActuallySpent = totalSpent;
            const totalReserved = budgets.reduce((total: number, row: BudgetRowProps) => {
                if (row.isReserved) {
                    const sum = total + (row.totalAmount - row.spentAmount);
                    return sum;
                } else {
                    return 0;
                }
            }, 0);
            state.totalReserved = totalReserved;
        },

        // pass in the amount to be reserved (or a negative amount for unreserving)
        updateTotalReserved(state, action) {
            const reservedAmount = action.payload;
            state.totalReserved += reservedAmount;
        },

        // pass in the selectedDate date object
        updateSelectedDate(state, action) {
            const selectedDate = action.payload;
            const selectedMonth = selectedDate.selectedMonth;
            const selectedMonthString = months[selectedMonth];
            const selectedYear = selectedDate.selectedYear;

            // Create monthYear string from selectedMonth and selectedYear
            const month =
                (selectedMonth + 1).toString().length === 2
                    ? (selectedMonth + 1).toString()
                    : "0" + (selectedMonth + 1).toString();
            const year = selectedYear.toString();
            const monthYear = year + "-" + month;

            console.log("updated monthYear", monthYear);

            state.selectedMonth = selectedMonth;
            state.selectedMonthString = selectedMonthString;
            state.selectedYear = selectedYear;
            state.monthYear = monthYear;
        }
    }
});

export const { updateSpendingBudget, updateBudgets, updateTotalReserved, updateSelectedDate } = budgetSlice.actions;

export default budgetSlice.reducer;
