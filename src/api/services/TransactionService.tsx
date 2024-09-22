import { URL } from '../Endpoint';

const transactionsUrl = URL + "/transactions";

// Mapping for getting all transactions by userId
export const URL_getTransactionsBYUserId = transactionsUrl;

// Mapping for getting the most recent 5 transactions
export const URL_getRecentFiveTransactions = `${transactionsUrl}/recentTransactions`;

// Mapping for getting transaction for the current month
export const URL_getTransactionsFromCurrentMonth = `${transactionsUrl}/currentMonthTransactions`;

// Mapping for getting all transactions by vendorName and userId
export const URL_getTransactionsByUserIdAndVendorName = `${transactionsUrl}/vendor/{vendorName}`;
export const getUrl_getTransactionsByUserIdAndVendorName = (vendorName: string) => {
    return URL_getTransactionsByUserIdAndVendorName.replace("{vendorName}", vendorName);
}

// Mapping for creating a transaction
export const URL_createTransaction = transactionsUrl;

// Mapping for updating a transaction
export const URL_updateTransaction = `${transactionsUrl}/{id}`;
export const getUrl_updateTransaction = (id: number) => {
    return URL_updateTransaction.replace("{id}", id.toString());
}

// Mapping for deleting a transaction with transaction ID
export const URL_deleteTransaction = `${transactionsUrl}/{id}`;
export const getUrl_deleteTransaction = (id: number) => {
    return URL_deleteTransaction.replace("{id}", id.toString());
}