import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface deductions{
    "dedid"?: number,
    "dedtaxReturn"?: number,
    "deddeduction": number,
    "deddeductionName"?: string,
    "dedamountSpent": number,
    "dednetDeduction"?: number
}

const initialState: deductions = {
    "dedid": 0,
    "dedtaxReturn": 0,
    "deddeduction": 0,
    "deddeductionName": "",
    "dedamountSpent": 0,
    "dednetDeduction": 0
}


export const deductions = createSlice({
    name: 'otherIncome',
    initialState,
    reducers: {
        setDeductionsInfo: (state, action: PayloadAction<deductions>) => {
            return { ...state, ...action.payload };
        },
        resetDeductionsInfo: () => initialState,
        
    }
});

export const { setDeductionsInfo, resetDeductionsInfo } = deductions.actions;

export default deductions.reducer;