export interface FormSubmissionState {
    status: number;
}

export enum State {
    WAITING = 0,
    SENDING,
    RETURNED
}