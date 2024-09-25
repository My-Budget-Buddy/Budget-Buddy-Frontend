// import axios from "axios";
import { Account, Transaction, TransactionCategory } from "../types/models.ts";
import { createTransactionAPI, deleteTransactionAPI, getAccountsByUserIdAPI, getTransactionByUserIdAPI, getTransactionByVendorAPI, updateTransactionAPI } from "../pages/Tax/taxesAPI.ts";

export const getTransactionByUserId = async (userId: number): Promise<Transaction[]> => {
    //const response = await axios.get<Transaction[]>(`${TRANSACTIONS_API_URL}/user/${userId}`);
    return(getTransactionByUserIdAPI(userId)
    .then((res) => {
        return res.data;
    }))
    
};

export const deleteTransaction = async (transactionId: number): Promise<void> => {
    deleteTransactionAPI(transactionId);
};

export const getAccountsByUserId = async (userId: number): Promise<Account[]> => {
    //const response = await axios.get<Account[]>(`${ACCOUNTS_API_URL}/${userId}`);
    return(getAccountsByUserIdAPI(userId)
    .then((res) => {
        return res.data;
    })
)
};

export const createTransaction = async (transaction: Omit<Transaction, "transactionId">): Promise<Transaction> => {
    //const response = await axios.post<Transaction>(`${TRANSACTIONS_API_URL}/createTransaction`, transaction);
    return(createTransactionAPI(transaction)
    .then((res) => {
        return res.data;
    })
)
};

export const updateTransaction = async (transaction: Transaction): Promise<Transaction> => {
    //const response = await axios.put<Transaction>(`${TRANSACTIONS_API_URL}/updateTransaction`, transaction);

    const response = await updateTransactionAPI(transaction.transactionId, transaction);
    return response.data;

};
export const getTransactionByVendor = async (vendorName: string): Promise<Transaction[]> => {
    //const response = await axios.get<Transaction[]>(`${TRANSACTIONS_API_URL}/user/${userId}/vendor/${vendorName}`);
    return(getTransactionByVendorAPI(vendorName)
    .then((res) => {
        return res.data;
    })
)
};

export const validateTransaction = (transaction: Omit<Transaction, 'transactionId'>): string[] => {
    const errors: string[] = [];
    const { vendorName, date, amount, category, accountId } = transaction;

    if (!vendorName || vendorName.trim() === '') {
        errors.push('Vendor name is required.');
    }
    if (vendorName.length > 100) {
        errors.push('Vendor name cannot exceed 100 characters.');
    }
    if (!date) {
        errors.push('Date is required.');
    } else if (new Date(date) > new Date()) {
        errors.push('Date cannot be in the future.');
    } else if (isNaN(Date.parse(date))) {
        errors.push('Date is invalid.');
    }
    if (amount <= 0) {
        errors.push('Amount must be greater than zero.');
    }
    if (amount > 1000000) {
        errors.push('Amount is excessively large.');
    }
    if (!category) {
        errors.push('Category is required.');
    }
    if (!Object.values(TransactionCategory).includes(category as TransactionCategory)) {
        errors.push('Invalid category.');
    }
    if (!accountId) {
        errors.push('Account is required.');
    }
    return errors;
};


