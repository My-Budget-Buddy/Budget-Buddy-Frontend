import { URL } from '../Endpoint';

const creditScoreUrl = URL + '/api/credit';

// Get credit score
export const URL_getCreditScore = `${creditScoreUrl}/score`;

// Save credit data
export const URL_saveCreditData = `${creditScoreUrl}/data`;

// Get credit score history
export const URL_getCreditScoreHistory = `${creditScoreUrl}/history`;

// Update user credit data
export const URL_updateUserCreditData = `${creditScoreUrl}/data`;

// Update credit accounts
export const URL_getCreditReport = `${creditScoreUrl}/report`;

// Get tips for credit improvement
export const URL_getCreditImprovementTips = `${creditScoreUrl}/tips`;