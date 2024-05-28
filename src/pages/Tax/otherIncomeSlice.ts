import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface otherIncome{
    "oitaxReturnId": number,
    "oilongTermCapitalGains": number,
    "oishortTermCapitalGains": number,
    "oiotherInvestmentIncome": number,
    "oinetBusinessIncome": number,
    "oiadditionalIncome": number
}

const initialState: otherIncome = {
    "oitaxReturnId": 0,
    "oilongTermCapitalGains": 0,
    "oishortTermCapitalGains": 0,
    "oiotherInvestmentIncome": 0,
    "oinetBusinessIncome": 0,
    "oiadditionalIncome": 0
}


export const otherIncome = createSlice({
    name: 'otherIncome',
    initialState,
    reducers: {
        setOtherIncomeInfo: (state, action: PayloadAction<otherIncome>) => {
            return { ...state, ...action.payload };
        },
        resetOtherIncomeInfo: () => initialState,
        
    }
});

export const { setOtherIncomeInfo, resetOtherIncomeInfo } = otherIncome.actions;

export default otherIncome.reducer;