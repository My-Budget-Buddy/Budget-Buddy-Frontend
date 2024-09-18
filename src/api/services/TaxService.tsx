import { URL } from '../Endpoint';

// --- DEDUCTION CONTROLLER ---

const deductionsUrl = URL + "/deductions";

// Find deduction by deduction ID
export const URL_findDeductionById = `${deductionsUrl}/{id}`;
export const getUrl_findDeductionById = (id: number) => {
    URL_findDeductionById.replace("{id}", id.toString());
}

// Retrieve list of all Deductions
export const URL_findAllDeductions = deductionsUrl;

// --- OTHER INCOME CONTROLLER ---

const otherIncomeUrl = URL + "/other-income";

// Find other income by tax return ID
export const URL_findByTaxReturnId = `${otherIncomeUrl}/{taxReturnId}`;
export const getUrl_findOtherIncomeByTaxReturnId = (taxReturnId: number) => {
    return URL_findByTaxReturnId.replace("{taxReturnId}", taxReturnId.toString());
}

// Add other income
export const URL_addOtherIncome = otherIncomeUrl;

// Update other income
export const URL_updateOtherIncome = otherIncomeUrl;

// Delete other income by DTO
export const URL_deleteOtherIncome = otherIncomeUrl;

// Delete other income by ID
export const URL_deleteOtherIncomeById = `${otherIncomeUrl}/{otherIncomeId}`;
export const getUrl_deleteOtherIncomeById = (otherIncomeId: number) => {
    return URL_deleteOtherIncomeById.replace("{otherIncomeId}", otherIncomeId.toString());
}

// --- TAX RETURN CONTROLLER ---

const taxReturnsUrl = URL + "/taxreturns";

// Add new TaxReturn. Should at least contain the year and can be updated later. Can also contain all user info but a
// POST must be done before filing W2s because the TaxReturn ID is needed to associate the W2s with the TaxReturn:
export const URL_addTaxReturn = taxReturnsUrl;

// Get TaxReturn by id
export const URL_findById = `${taxReturnsUrl}/{id}`;
export const getUrl_findById = (id: number) => {
    return URL_findById.replace("{id}", id.toString());
}

// Get current federal tax refund
export const URL_getRefund = `${taxReturnsUrl}/{id}/refund`;
export const getUrl_getRefund = (id: number) => {
    return URL_getRefund.replace("{id}", id.toString());
}

// Get all TaxReturns by userId (and optionally by year)
export const URL_findAllByUserId = taxReturnsUrl;

// Update TaxReturn
export const URL_updateTaxReturn = `${taxReturnsUrl}/{id}`;
export const getUrl_updateTaxReturn = (id: number) => {
    return URL_updateTaxReturn.replace("{id}", id.toString());
}

// Delete TaxReturn
export const URL_deleteTaxReturn = `${taxReturnsUrl}/{id}`;
export const getUrl_deleteTaxReturn = (id: number) => {
    return URL_deleteTaxReturn.replace("{id}", id.toString());
}

// Claim deductions
export const URL_claimDeduction = `${taxReturnsUrl}/{id}/deductions`;
export const getUrl_claimDeduction = (id: number) => {
    return URL_claimDeduction.replace("{id}", id.toString());
}

// View a TaxReturnDeduction by ID
export const URL_getTaxReturnDeductionById = `${taxReturnsUrl}taxreturn/deductions/{taxReturnDeductionId}`;
export const getUrl_getTaxReturnDeductionById = (taxReturnDeductionId: number) => {
    return URL_getTaxReturnDeductionById.replace("{taxReturnDeductionId}", taxReturnDeductionId.toString());
}

// Get all deductions for a TaxReturn
export const URL_getDeductions = `${taxReturnsUrl}/{id}/deductions`;
export const getUrl_getDeductions = (id: number) => {
    return URL_getDeductions.replace("{id}", id.toString());
}

// Update a TaxReturnDeduction
export const URL_updateTaxReturnDeduction = `${taxReturnsUrl}taxreturn/deductions/{taxReturnDeductionId}`;
export const getUrl_updateTaxReturnDeduction = (taxReturnDeductionId: number) => {
    return URL_updateTaxReturnDeduction.replace("{taxReturnDeductionId}", taxReturnDeductionId.toString());
}

// Delete a TaxReturnDeduction
export const URL_deleteTaxReturnDeduction = `${taxReturnsUrl}taxreturn/deductions/{taxReturnDeductionId}`;
export const getUrl_deleteTaxReturnDeduction = (taxReturnDeductionId: number) => {
    return URL_deleteTaxReturnDeduction.replace("{taxReturnDeductionId}", taxReturnDeductionId.toString());
}

// Delete absolutely everything associated with a UserId
export const URL_deleteAllByUserId = `${taxReturnsUrl}/deleteAll`;

// View all possible Filing Statuses
export const URL_getFilingStatuses = `${taxReturnsUrl}/filingStatuses`;

// Submit completed TaxReturn
export const URL_submitTaxReturn = `${taxReturnsUrl}/{id}/submit`;
export const getUrl_submitTaxReturn = (id: number) => {
    return URL_submitTaxReturn.replace("{id}", id.toString());
}

// --- TAX RETURN CREDIT CONTROLLER ---

const taxReturnCreditUrl = URL + "/tax-return-credit";

// Find TaxReturnCredit by tax return ID
export const URL_findTaxReturnCreditByTaxReturnId = `${taxReturnCreditUrl}/{taxReturnId}`;
export const getUrl_findTaxReturnCreditByTaxReturnId = (taxReturnId: number) => {
    return URL_findTaxReturnCreditByTaxReturnId.replace("{taxReturnId}", taxReturnId.toString());
}

// Create new TaxReturnCredit
export const URL_createTaxReturnCredit = taxReturnCreditUrl;

// Update TaxReturnCredit
export const URL_updateTaxReturnCredit = taxReturnCreditUrl;

// Delete TaxReturnCredit by ID
export const URL_deleteTaxReturnCredit = `${taxReturnCreditUrl}/{id}`;
export const getUrl_deleteTaxReturnCreditById = (id: number) => {
    return URL_deleteTaxReturnCredit.replace("{id}", id.toString());
}

// --- W2 CONTROLLER ---

const w2Url = URL + "/w2s";

// Add new W2
export const URL_addW2sByTaxReturnId = w2Url;

// Find W2 by ID
export const URL_findW2ById = `${w2Url}/{id}`;
export const getUrl_findW2ById = (id: number) => {
    return URL_findW2ById.replace("{id}", id.toString());
}

// Find all W2s by UserId and optionally by Year
export const URL_findAllW2sByUserId = w2Url;

// Find all W2s by Tax Return ID
export const URL_findAllW2sByTaxReturnId = `${w2Url}/w2`;

// Update an existing W2
export const URL_updateW2 = `${w2Url}/{id}`;
export const getUrl_updateW2 = (id: number) => {
    return URL_updateW2.replace("{id}", id.toString());
}

// Delete W2 by ID
export const URL_deleteW2ById = `${w2Url}/{id}`;
export const getUrl_deleteW2ById = (id: number) => {
    return URL_deleteW2ById.replace("{id}", id.toString());
}

// Upload image to S3
export const URL_uploadImageToS3 = `${w2Url}/{id}/image`;
export const getUrl_uploadImageToS3 = (id: number) => {
    return URL_uploadImageToS3.replace("{id}", id.toString());
}

// Download image from S3
export const URL_downloadImageFromS3 = `${w2Url}/{id}/image`;
export const getUrl_downloadImageFromS3 = (id: number) => {
    return URL_downloadImageFromS3.replace("{id}", id.toString());
}