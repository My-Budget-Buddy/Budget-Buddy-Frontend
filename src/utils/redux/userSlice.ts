import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: "userData",
    initialState: {
        userId: ""
    } as userDataState,
    reducers: {
        updateUserId(state, action) {
            const userId = action.payload;
            state.userId = userId;
        }
    }
});

export const { updateUserId } = userSlice.actions;

export default userSlice.reducer;

interface userDataState {
    userId: string;
}
