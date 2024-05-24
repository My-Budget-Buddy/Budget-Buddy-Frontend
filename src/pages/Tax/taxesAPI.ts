import apiClient from './index';

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