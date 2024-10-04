import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface taxReturn{
    
        "filingStatus": string,
        "id"?: number,
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
        "ssn": any
    
};



export interface TaxReturnState {
    taxReturn: Partial<taxReturn>;
    taxReturns: taxReturn[];
  }
  
  const initialState: TaxReturnState = {
    taxReturn: {
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
        "ssn": null
    },
    taxReturns: [],
  };

export const taxReturnSlice = createSlice({
    name: 'taxReturn',
    initialState,
    reducers: {
        setTaxReturnInfo: (state, action: PayloadAction<Partial<taxReturn>>) => {
          state.taxReturn = { ...state.taxReturn, ...action.payload };
        },
        setAllTaxReturns: (state, action: PayloadAction<taxReturn[]>) => {
          state.taxReturns = action.payload;
        },
        resetTaxReturnInfo: () => initialState,
      },
});

export const { setTaxReturnInfo, setAllTaxReturns, resetTaxReturnInfo } = taxReturnSlice.actions;

export default taxReturnSlice.reducer;