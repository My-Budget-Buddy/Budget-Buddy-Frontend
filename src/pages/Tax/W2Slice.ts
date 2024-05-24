import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface W2State{
    "state": string,
    "id"?: number,
    "taxReturnId": number,
    "year": number,
    "userId": number,
    "employer": string,
    "wages": number,
    "federalIncomeTaxWithheld": number,
    "stateIncomeTaxWithheld": number,
    "socialSecurityTaxWithheld": number,
    "medicareTaxWithheld": number,
    "imageKey": any
}

const initialState: W2State = {
    "state": "FLORIDA",
    "taxReturnId": 1,
    "year": 2024,
    "userId": 1,
    "employer": "Skillstorm",
    "wages": 0,
    "federalIncomeTaxWithheld": 0,
    "stateIncomeTaxWithheld": 0,
    "socialSecurityTaxWithheld": 0,
    "medicareTaxWithheld": 0,
    "imageKey": null
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