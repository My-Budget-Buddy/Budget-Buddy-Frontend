import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface W2State{
    taxFormId : number,
    userId: number,
    status : string,
    formType : string,
}

const initialState: W2State = {
    taxFormId : 0,
    userId : 0,
    status : "pending",
    formType : "w2"
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