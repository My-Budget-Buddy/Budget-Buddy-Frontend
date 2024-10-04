import { createSlice } from "@reduxjs/toolkit";
import { SavingsBucketRowProps } from "../../../types/budgetInterfaces";

export const budgetSlice = createSlice({
    name: "update",
    initialState: {
        buckets: [], //TODO Annotate type
        totalReserved: 0
    },
    reducers: {
        updateBuckets(state, action) {
            const buckets = action.payload;
            state.buckets = buckets;

            const totalReserved = buckets.reduce((total: number, row: SavingsBucketRowProps) => {
                if (row.data.is_currently_reserved) {
                    const sum = total + row.data.amount_reserved;
                    return sum;
                } else {
                    return total;
                }
            }, 0);
            console.log("total reserved: ", totalReserved);
            state.totalReserved = totalReserved;
        },

        // pass in the amount to be reserved (or a negative amount for unreserving)
        updateTotalReserved(state, action) {
            const reservedAmount = action.payload;
            state.totalReserved += reservedAmount;
        }
    }
});

export const { updateBuckets, updateTotalReserved } = budgetSlice.actions;

export default budgetSlice.reducer;
