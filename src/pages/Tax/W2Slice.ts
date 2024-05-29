import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface W2State{
    "w2state": string,
    "w2id"?: number,
    "w2taxReturnId": number,
    "w2year": number,
    "w2userId": number,
    "w2employer": string,
    "w2wages": number,
    "w2federalIncomeTaxWithheld": number,
    "w2stateIncomeTaxWithheld": number,
    "w2socialSecurityTaxWithheld": number,
    "w2medicareTaxWithheld": number,
    "w2imageKey": any
}

const initialState: W2State = {
    "w2state": "FL",
    "w2taxReturnId": 1,
    "w2year": 2024,
    "w2userId": 1,
    "w2employer": "",
    "w2wages": 0,
    "w2federalIncomeTaxWithheld": 0,
    "w2stateIncomeTaxWithheld": 0,
    "w2socialSecurityTaxWithheld": 0,
    "w2medicareTaxWithheld": 0,
    "w2imageKey": null
}


export const W2Slice = createSlice({
    name: 'w2',
    initialState,
    reducers: {
        setW2Info: (state, action: PayloadAction<Partial<W2State>>) => {
            return { ...state, ...action.payload };
        },
        resetW2Info: () => initialState,
        
    }
});

export const { setW2Info, resetW2Info } = W2Slice.actions;

export default W2Slice.reducer;