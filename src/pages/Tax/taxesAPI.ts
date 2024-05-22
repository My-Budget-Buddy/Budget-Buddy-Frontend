import apiClient from './index';

interface initReturn {
    year : number,
    userId : number
}

export const createTaxReturn = (initTaxReturn : initReturn) => {
    return apiClient.post(`/taxes/taxreturns`, initTaxReturn);
}

export const getTaxReturnById = (taxReturnId : number) =>{
    return apiClient.get(`/taxes/taxreturns/${taxReturnId}`);
}

export const getTaxReturnByUserId = (userId : number) => {
    return apiClient.get(`/taxes/taxreturns?userId=${userId}`);
}