import apiClient from "./index";
import { Transaction } from "../../types/models";
import { W2State } from "./W2Slice";
import { taxReturn } from "./TaxReturnSlice";
import { otherIncome } from "./otherIncomeSlice";
import createApiClient from "./index";
interface initReturn {
    year: number;
    userId: number;
}

interface fields {
    type: string;
    institution: string;
    accountNumber: number;
    routingNumber: number;
    investmentRate: number;
    startingBalance: number;
}

interface RawBudgetToSend {
    //budgetId: number;
    userId: number;
    category: string;
    totalAmount: number;
    isReserved: boolean;
    monthYear: string;
    notes: string;
    //createdTimestamp: string;
}

type MonthlySummary = {
    summaryId: number;
    userId?: string;
    projectedIncome?: number;
    monthYear?: string;
    totalBudgetAmount?: number;
};

type NewMonthlySummary = {
    userId: number;
    monthYear: string;
    totalBudgetAmount: number;
};

interface W2StateR {
    state: string;
    id?: number;
    taxReturnId: number;
    year: number;
    userId: number;
    employer: string;
    wages: number;
    federalIncomeTaxWithheld: number;
    stateIncomeTaxWithheld: number;
    socialSecurityTaxWithheld: number;
    medicareTaxWithheld: number;
    imageKey: any;
}

interface RawBucketToSend {
    // bucketId: number;
    userId: number;
    bucketName: string;
    amountReserved: number;
    amountRequired: number;
    // dateCreated: string;
    isActive: boolean;
    isReserved: boolean;
    // monthYear: string;
}

interface otherIncomeToSend {
    taxReturnId: number;
    longTermCapitalGains: number;
    shortTermCapitalGains: number;
    otherInvestmentIncome: number;
    netBusinessIncome: number;
    additionalIncome: number;
}
// export const initApiClient = () => {
//     const apiClient = createApiClient(jwt);
//     return apiClient
// }

interface ProfileType {
    firstName: string;
    lastName: string;
    email: string;
    id: number;
}

export const createTaxReturn = (initTaxReturn: initReturn) => {
    console.log("////////////////////////////////");
    console.log(initTaxReturn);
    return apiClient.post(`/taxes/taxreturns`, initTaxReturn);
};

export const getTaxReturnById = (taxReturnId: number) => {
    return apiClient.get(`/taxes/taxreturns/${taxReturnId}`);
};

export const getTaxReturnByUserId = (jwt: string | null, userId: number) => {
    console.log("////////////////////////////////");
    console.log(jwt);
    return apiClient.get(`/taxes/taxreturns`);
};

export const getAccountByID = () => {
    return apiClient.get(`/accounts`);
};

export const postAccountData = (field: fields) => {
    console.log(field);
    return apiClient.post("/accounts", field);
};

export const getBudgetsMonthyear = (monthyear: string) => {
    //const apiClient = createApiClient(jwt);
    return apiClient.get(`/budgets/monthyear/${monthyear}`);
};

export const getTransactionsThing = (date: string, userid: number) => {
    return apiClient.get(`/budgets/transactions/${date}/user/${userid}`);
};

export const getBudgetsTransactionsMonthyear = (monthyear: string) => {
    return apiClient.get(`/budgets/transactions/${monthyear}/user/1`);
};

export const getMonthlySummaryAPI = (monthyear: string) => {
    return apiClient.get(`/summarys/monthyear/${monthyear}`);
};

export const updateMonthlySummaryAPI = (summaryId: number, monthlySummary: MonthlySummary) => {
    return apiClient.put(`/summarys/${summaryId}`, monthlySummary);
};

export const createMonthlySummaryAPI = (monthlySummary: NewMonthlySummary) => {
    return apiClient.post(`/summarys`, monthlySummary);
};

export const getBudgetsByIdAPI = () => {
    return apiClient.get(`/budgets/1`);
};

export const createBudgetAPI = (budget: RawBudgetToSend) => {
    return apiClient.post(`/budgets`, budget);
};

export const deleteBudgetAPI = (id: number) => {
    return apiClient.delete(`/budgets/${id}`);
};

export const updateBudgetAPI = (id: number, budget: RawBudgetToSend) => {
    return apiClient.put(`/budgets/${id}`, budget);
};

export const getTransactionByUserIdAPI = (userId: number) => {
    return apiClient.get(`/transactions`);
};

export const getAccountsByUserIdAPI = (userId: number) => {
    return apiClient.get(`/accounts`);
};

export const deleteTransactionAPI = (transactionId: number) => {
    return apiClient.delete(`/transactions/${transactionId}`);
};

export const createTransactionAPI = (transaction: Omit<Transaction, "transactionId">) => {
    return apiClient.post(`/transactions`, transaction);
};

export const updateTransactionAPI = (transactionId: number, transaction: Transaction) => {
    return apiClient.put(`/transactions/${transactionId}`, transaction);
};

export const getTransactionByVendorAPI = (vendorName: string) => {
    return apiClient.get(`/transactions/vendor/${vendorName}`);
};

export const getRecentTransactionsAPI = () => {
    return apiClient.get(`/transactions/recentTransactions`);
};

export const getCurrentMonthTransactionsAPI = () => {
    return apiClient.get(`/transactions/currentMonthTransactions`);
};

export const deleteAccountAPI = (accountId: number) => {
    return apiClient.delete(`/accounts/${accountId}`);
};

export const createW2API = (w2payload: Omit<W2State, "w2id">[]) => {
    const result: W2StateR[] = [];
    for (const payload of w2payload) {
        const mappedPayload: W2StateR = {
            state: payload.w2state,
            taxReturnId: payload.w2taxReturnId,
            year: payload.w2year,
            userId: payload.w2userId,
            employer: payload.w2employer,
            wages: payload.w2wages,
            federalIncomeTaxWithheld: payload.w2federalIncomeTaxWithheld,
            stateIncomeTaxWithheld: payload.w2stateIncomeTaxWithheld,
            socialSecurityTaxWithheld: payload.w2socialSecurityTaxWithheld,
            medicareTaxWithheld: payload.w2medicareTaxWithheld,
            imageKey: undefined
        };
        result.push(mappedPayload);
    }

    return apiClient.post(`/taxes/w2s?taxReturnId=1`, result);
};

export const createTaxReturnAPI = (taxPayload: Omit<taxReturn, "id">) => {
    return apiClient.put(`/taxes/taxreturns`, taxPayload);
};

export const findW2sByTaxReturnIdAPI = () => {
    return apiClient.get(`/taxes/w2s?taxReturnId=1`);
};

export const findAllDeductionsByTaxReturnAPI = () => {
    return apiClient.get(`/taxes/taxreturns/1/deductions`);
};

export const getBucketsAPI = () => {
    return apiClient.get(`/buckets/user/1`);
};

export const addBucketsAPI = (bucket: RawBucketToSend) => {
    return apiClient.post(`/buckets/add`, bucket);
};

export const updateBucketAPI = (bucket: RawBucketToSend, id: number) => {
    return apiClient.put(`/buckets/update/${id}`, bucket);
};

export const deleteBucketAPI = (id: number) => {
    return apiClient.delete(`/buckets/delete/${id}`);
};

export const updateTaxReturnAPI = (payload: Partial<taxReturn>, id: number | undefined) => {
    return apiClient.put(`/taxes/taxreturns/${id}`, payload);
};

export const addOtherIncomeAPI = (payload: otherIncome) => {
    const actual_payload: otherIncomeToSend = {
        taxReturnId: payload.oitaxReturnId,
        longTermCapitalGains: payload.oilongTermCapitalGains,
        shortTermCapitalGains: payload.oishortTermCapitalGains,
        otherInvestmentIncome: payload.oiotherInvestmentIncome,
        netBusinessIncome: payload.oinetBusinessIncome,
        additionalIncome: payload.oiadditionalIncome
    };
    return apiClient.post(`/taxes/other-income`, actual_payload);
};

export const getOtherIncomeAPI = () => {
    return apiClient.get(`/taxes/other-income/1`);
};

export const deleteTaxReturn = (id: number | undefined) => {
    return apiClient.delete(`/taxes/taxreturns/${id}`);
};

export const getUserInformationAPI = () => {
    return apiClient.get(`/users/user`);
};

export const updateUserInfo = (profile: ProfileType) => {
    console.log("UPDATE PROFILE: ", profile);
    return apiClient.put(`/users`, profile);
};
