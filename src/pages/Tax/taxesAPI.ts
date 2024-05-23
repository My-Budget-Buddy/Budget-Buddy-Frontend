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
    balance: number
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