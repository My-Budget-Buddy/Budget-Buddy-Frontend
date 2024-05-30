import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    isAuthenticated: false
};

export const authSlice = createSlice({
    name: "isAuthenticated",
    initialState,
    reducers: {
        setAuthenticated: (state, action: PayloadAction<boolean>) => {
            state.isAuthenticated = action.payload;
        }
    }
});

// Export the action and reducer
export const { setAuthenticated } = authSlice.actions;
export default authSlice.reducer;
