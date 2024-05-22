export interface FormSubmissionState {
    status: number;
}

export enum State {
    READY = 0, //A request can be sent.
    WAITING = 1, // The program has marked that a form will be sent, but has not actually made a fetch request yet.
    SENDING = 2, // A fetch request or form has been submitted over the network.
    RETURNED = 3 // A request has returned from the network.
}

export interface SavingsBucketRowProps {
    data: {
        id: number;
        name: string;
        amount_required: number;
        amount_reserved: number;
        is_currently_reserved: boolean;
    };
}

export interface BudgetRowProps {
    id: number;
    category: string;
    totalAmount: number;
    isReserved: boolean;
    notes: string;
}

export interface BudgetProps {
    data: {
        value: number;
    };
}
