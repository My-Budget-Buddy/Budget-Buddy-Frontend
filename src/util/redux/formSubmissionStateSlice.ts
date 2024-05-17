import { createSlice } from '@reduxjs/toolkit'
import { FormSubmissionState, State } from '../misc/interfaces';



export const formSubmissionStateSlice = createSlice({
  
//This store is set so that we can ensure a user can only attempt one form submission at a time. To do this, form submissions should be globally managed with useEffect calls, and we should manually check what the current state of the form submission is. 
// Essentially, this is a locking mutex.
  name: 'submissionState',
  initialState: {
    status: State.WAITING
  } as FormSubmissionState,
  reducers: {
    // After the state changed to RETURNED, make sure to manually set it back to WAITING
    allowNewFetch: state => {
      state.status = State.WAITING; 
    },
    markAsSending: state => {
      if(state.status === State.WAITING){
        state.status = State.SENDING; 
      }  else if(state.status === State.RETURNED) {
        console.log("Busy attempting earlier submission")
      } else {
        console.log("Error- form RETURNED but you are unable to send a new form. Try refreshing the page.")
      }
    },
    markAsReturned: state => {
      state.status = State.RETURNED; 
    }
  }
})

export const { markAsSending, allowNewFetch, markAsReturned} = formSubmissionStateSlice.actions

export default formSubmissionStateSlice.reducer