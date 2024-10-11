import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SimpleSubmissionState {
  isSending: boolean;
}

type SetIsSendingPayload = boolean;

const initialState: SimpleSubmissionState = {
  isSending: false,
};

export const simpleSubmissionSlice = createSlice({
  name: 'isSending',
  initialState,
  reducers: {
    setIsSending: (state, action: PayloadAction<SetIsSendingPayload>) => {
      state.isSending = action.payload;
    },
  },
});

// Export the action and reducer
export const { setIsSending } = simpleSubmissionSlice.actions;
export default simpleSubmissionSlice.reducer;
