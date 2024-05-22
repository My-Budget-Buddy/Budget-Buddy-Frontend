import apiClient from './index';

interface initReturn {
    year : number,
    userID : number
}

export const createTaxReturn = (initTaxReturn : initReturn) => {
    return apiClient.post(`/taxes/taxreturns`, initTaxReturn);
}