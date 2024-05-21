import axios from "axios";
import {Account, Transaction} from '../types/models.ts';

const TRANSACTIONS_API_URL = "http://localhost:8083/transactions";
const ACCOUNTS_API_URL = "http://localhost:8080/accounts";

export const getTransactionByUserId = async (userId: number): Promise<Transaction[]> => {
    const response = await axios.get<Transaction[]>(`${TRANSACTIONS_API_URL}/user/${userId}`);
    return response.data;
};

export const deleteTransaction = async (transactionId: number): Promise<void> => {
    await axios.delete(`${TRANSACTIONS_API_URL}/deleteTransaction/${transactionId}`);
};

export const getAccountsByUserId = async (userId: number): Promise<Account[]> => {
    const response = await axios.get<Account[]>(`${ACCOUNTS_API_URL}/${userId}`);
    return response.data;
};
