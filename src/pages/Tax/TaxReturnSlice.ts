import { W2State } from "./W2Slice";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface taxReturn{
    
        "filingStatus": string,
        "id": number,
        "year": number,
        "userId": number,
        "firstName": any,
        "lastName": any,
        "email": any,
        "phoneNumber": any,
        "address": any,
        "city": any,
        "state": any,
        "zip": any,
        "dateOfBirth": any,
        "ssn": any,
        "w2s": W2State[],
        "otherIncome": any,
        "taxCredit": any,
        "totalIncome": number,
        "adjustedGrossIncome": number,
        "taxableIncome": number,
        "fedTaxWithheld": number,
        "stateTaxWithheld": number,
        "socialSecurityTaxWithheld":number,
        "medicareTaxWithheld": number,
        "totalDeductions": number,
        "totalCredits": number,
        "federalRefund": number,
        "stateRefund": number
    
};

const initialState : taxReturn = {
    "filingStatus": "SINGLE",
    "id": 1,
    "year": 2024,
    "userId": 1,
    "firstName": null,
    "lastName": null,
    "email": null,
    "phoneNumber": null,
    "address": null,
    "city": null,
    "state": null,
    "zip": null,
    "dateOfBirth": null,
    "ssn": null,
    "w2s": [],
    "otherIncome": null,
    "taxCredit": null,
    "totalIncome": 0.00,
    "adjustedGrossIncome": 0.00,
    "taxableIncome": 0.00,
    "fedTaxWithheld": 0.00,
    "stateTaxWithheld": 0.00,
    "socialSecurityTaxWithheld": 0.00,
    "medicareTaxWithheld": 0.00,
    "totalDeductions": 0.00,
    "totalCredits": 0.00,
    "federalRefund": 0.00,
    "stateRefund": 0.00
};

export const taxReturnSlice = createSlice({
    name: 'taxReturn',
    initialState,
    reducers: {
        setTaxReturnInfo: (state, action: PayloadAction<Partial<taxReturn>>) => {
            return { ...state, ...action.payload };
        },
        resetTaxReturnInfo: () => initialState,
        
    }
});

export const { setTaxReturnInfo, resetTaxReturnInfo } = taxReturnSlice.actions;

export default taxReturnSlice.reducer;