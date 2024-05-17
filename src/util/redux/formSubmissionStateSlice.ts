import { createSlice } from '@reduxjs/toolkit'

enum State {
  WAITING = 0,
  SENT,
  RETURNED

}

export const formSubmissionStateSlice = createSlice({
  
//This store is set so that we can ensure a user can only attempt one form submission at a time. To do this, form submissions should be globally managed with useEffect calls, and we should manually check what the current state of the form submission is. 
  name: 'submissionState',
  initialState: {
    status: State.WAITING
  },
  reducers: {
    // After the state changed to RETURNED, make sure to manually set it back to WAITING
    allowNewFetch: state => {
      state.status = State.WAITING; 
    },
    attemptSend: state => {
      if(state.status === State.WAITING){
        state.status = State.SENT; 
      }  else if(state.status === State.RETURNED) {
        console.log("Busy attempting earlier submission")
      } else {
        console.log("Error- form RETURNED but you are unable to send a new form. Try refreshing the page.")
      }
    },
    returnedComplete: state => {
      state.status = State.RETURNED; 
    }
  }
})

export const { attemptSend } = formSubmissionStateSlice.actions

export default formSubmissionStateSlice.reducer