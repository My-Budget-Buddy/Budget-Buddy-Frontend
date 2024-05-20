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
