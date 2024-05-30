export enum TransactionCategory {
    GROCERIES = "Groceries",
    ENTERTAINMENT = "Entertainment",
    DINING = "Dining",
    TRANSPORTATION = "Transportation",
    HEALTHCARE = "Healthcare",
    LIVING_EXPENSES = "Living Expenses",
    SHOPPING = "Shopping",
    INCOME = "Income",
    MISC = "Misc"
}

export interface Account {
    id: number;
    userId: string;
    type: "CHECKING" | "SAVINGS" | "CREDIT" | "INVESTMENT";
    accountNumber: string;
    routingNumber: string;
    institution: string;
    investmentRate: number | null;
    startingBalance: number;
    currentBalance: number;
}

export interface Bucket {
    bucketId: number;
    userId: number;
    bucketName: string;
    amountRequired: number;
    amountAvailable: number;

    /** YYYY-MM format */
    monthYear: string;
    isReserved: boolean;
    isActive: boolean;

    /** ISO 8601 format -- `"2024-05-21T14:05:43.803343"` */
    dateCreated: string;
}

export interface Budget {
    budgetId: number;
    userId: number;
    category: string;
    spentAmount: number | null;
    isReserved: boolean;

    /** YYYY-MM format */
    monthYear: string;
    notes: string;

    /** ISO 8601 format -- `"2024-05-21T14:05:43.803343"` */
    createdTimeStamp: string;
}

export interface Transaction {
    transactionId: number;
    userId: number;
    accountId: number;
    vendorName: string;
    amount: number;
    description: string | null;
    category: TransactionCategory;

    /** YYYY-MM-DD format */
    date: string;
}

export interface User {
    id: number;
    email: string;
    firstName: string | null;
    lastName: string | null;
}
