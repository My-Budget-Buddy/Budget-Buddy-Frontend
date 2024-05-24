import apiClient from './index';
import { Transaction } from '../../types/models';
import { W2State } from './W2Slice';
import { taxReturn } from './TaxReturnSlice';
interface initReturn {
    year : number,
    userId : number
}

interface fields {
    type: string,
    institution: string,
    accountNumber: number,
    routingNumber: number,
    investmentRate: number,
    startingBalance: number
};

interface RawBudgetToSend {
    //budgetId: number;
    userId: number;
    category: string;
    totalAmount: number;
    isReserved: boolean;
    monthYear: string;
    notes: string;
    //createdTimestamp: string;
};

export const createTaxReturn = (initTaxReturn : initReturn) => {
    return apiClient.post(`/taxes/taxreturns`, initTaxReturn);
}

export const getTaxReturnById = (taxReturnId : number) =>{
    return apiClient.get(`/taxes/taxreturns/${taxReturnId}`);
}

export const getTaxReturnByUserId = (userId : number) => {
    return apiClient.get(`/taxes/taxreturns?userId=${userId}`);
}

export const getAccountByID = () => {
    return apiClient.get(`/accounts/1`);
}

export const postAccountData = (field : fields) => {
    console.log(field);
    return apiClient.post('/accounts/1', field);
}

export const getBudgetsMonthyear = (monthyear : string) => {
    return apiClient.get(`/budgets/monthyear/${monthyear}/user/1`);
}

export const getTransactionsThing = (date : string, userid : number) => {
    return apiClient.get(`/budgets/transactions/${date}/user/${userid}`);
}

export const getBudgetsTransactionsMonthyear = (monthyear : string) => {
    return apiClient.get(`/budgets/transactions/${monthyear}/user/1`)
}

export const getBudgetsByIdAPI = () => {
    return apiClient.get(`/budgets/1`);
}

export const createBudgetAPI = (budget: RawBudgetToSend) =>{
    return apiClient.post(`/budgets`, budget);
}

export const deleteBudgetAPI = (id : number) => {
    return apiClient.delete(`/budgets/${id}`)
}

export const updateBudgetAPI = (id : number, budget : RawBudgetToSend) => {
    return apiClient.put(`/budgets/${id}`, budget);
}

export const getTransactionByUserIdAPI = (userId: number) => {
    return apiClient.get(`/transactions/user/${userId}`);
}

export const getAccountsByUserIdAPI = (userId:number) => {
    return apiClient.get(`/accounts/${userId}`);
}

export const deleteTransactionAPI = (transactionId:number) => {
    return apiClient.delete(`/transactions/deleteTransaction/${transactionId}`);
}

export const createTransactionAPI = (transaction: Omit<Transaction, "transactionId">) => {
    return apiClient.post(`/transactions/createTransaction`, transaction);
}

export const getTransactionByVendorAPI = (userId:number, vendorName:string) => {
    return apiClient.get(`/transactions/user/${userId}/vendor/${vendorName}`);
}

export const getRecentTransactionsAPI = () => {
    return apiClient.get(`/transactions/recentTransactions/1`);
}

export const getCurrentMonthTransactionsAPI = () => {
    return apiClient.get(`/transactions/currentMonthTransactions/1`);
}

export const deleteAccountAPI = (accountId: number) => {
    return apiClient.delete(`/accounts/1/${accountId}`);
}

export const createW2API = (w2payload: W2State) => {
    return apiClient.post(`/taxes/w2s?taxReturnId=1`, w2payload);
}

export const createTaxReturnAPI = (taxPayload: taxReturn) => {
    return apiClient.post(`/taxes/taxreturns/1`, taxPayload);
}